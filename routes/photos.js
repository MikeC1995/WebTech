'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Place = require('../models/place.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');
var aws = require('../config/aws.js');
var _async = require('async');
var userLists = require('../helpers/user-lists.js');

module.exports = {
  get:  function(req, res) {
    if(!req.query.place_id) {
      return error.BadRequest(res, 'place_id');
    }

    new Promise(function(resolve, reject) {
      Place.findById(req.query.place_id, function(err, place) {
        if(err) reject(error.InternalServerError);
        if(!place) reject(error.NotFound);

        if(req.isAuthenticated() && req.user._id) {
          // authenticated

          // if place owner is the authenticated user themself
          if(String(place.user_id )== String(req.user._id)) {
            resolve();
          }

          // otherwise place owner must be on whitelist or friendlist
          userLists.allowedList(req.user).then(function(users) {
            for(var i = 0; i < users.length; i++) {
              if(String(users[i]._id) == String(place.user_id)) {
                resolve();
              }
            }
            return reject(error.Forbidden);
          }, function() {
            return reject(error.InternalServerError);
          });
        } else {
          // not authenticated, place owner must be on whitelist
          userLists.whitelist().then(function(users) {
            for(var i = 0; i < users.length; i++) {
              if(String(users[i]._id) == String(place.user_id)) {
                resolve();
              }
            }
            return reject(error.Forbidden);
          }, function() {
            return reject(error.InternalServerError);
          });
        }
      });
    }).then(function() {
      // authorised request

      // set max number of photos, absolute max (and default) is 50
      var limit = 50;
      if(req.query.limit) {
        limit = req.query.limit < limit ? req.query.limit : limit;
      }

      var params = {
        place_id: req.query.place_id
      }
      // One of timebefore or timeafter can be specified, only photos
      // with a timestamp before/after this date will be returned
      if(req.query.timebefore) {
        params.timestamp = { $lt: req.query.timebefore };
      } else if(req.query.timeafter) {
        params.timestamp = { $gt: req.query.timeafter };
      }
      Photo.find(params)
        .sort({'timestamp': -1})
        .limit(Number(limit))
        .exec(
          function(err, photos) {
            if(err) return error.InternalServerError(res);
            if(!photos) return error.NotFound(res);
            sendUrls(photos);
          }
        );

      // Send signed urls for the images in s3
      function sendUrls(photos) {
        var response = [];
        for(var i = 0; i < photos.length; i++) {
          var url = aws.s3.getSignedUrl('getObject', { Bucket: aws.imagesBucket, Key: photos[i].key });
          var thumbUrl = aws.s3.getSignedUrl('getObject', { Bucket: aws.thumbnailsBucket, Key: "resized-" + photos[i].key });
          var photo = {
            url: url,
            thumbUrl: thumbUrl,
            _id: photos[i]._id
          }
          response.push(photo);
        }
        return success.OK(res, response);
      }
    }, function(errorFunction) {
      return errorFunction(res);
    });
  },
  getById: function(req, res) {
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }

    Photo.findById(req.params.id, function(err, photo) {
      if(err) return error.InternalServerError(res);
      if(!photo) return error.NotFound(res);

      if(req.isAuthenticated() && req.user._id) {
        // authenticated

        // photo belongs to the user
        if(String(photo.user_id) == String(req.user._id)) {
          return success.OK(res, photo);
        }

        // otherwise photo must belong to user's friend or whitelisted user
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(photo.user_id)) {
              return success.OK(res, photo);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      } else {
        // not authenticated: photo must belong to whitelisted user
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(photo.user_id)) {
              return success.OK(res, photo);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      }
    });
  },
  post: function(req, res) {
    // user must be authenticated to add photo
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary params
    if(!req.body.place_id) {
      return error.BadRequest(res, 'place_id');
    }

    Place.findById(req.body.place_id, function(err, place) {
      if(err) return error.InternalServerError(res);
      if(!place) return error.BadRequest(res, 'place_id');  // ensure place exists

      // ensure user owns the place to photo will be posted to
      if(String(place.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      // all ok

      // Upload each file to AWS S3 and store filename in db
      var calls = [];
      req.files.forEach(function(file) {
        calls.push(function(callback) {
          // Save under filename of the form: <place_id>-<timedatestamp>-<originalname>.<extension>
          var timestamp = Date.now();
          var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
          var originalname = file.originalname.split('.').slice(0, -1)[0].replace(/ /g,''); // file extension + whitespace removed
          var filename = req.body.place_id + "-" + timestamp + "-" + originalname + "." + extension;

          // Save to S3
          var params = {
            Bucket: aws.imagesBucket,
            Key: filename,
            Body: file.buffer
          };
          aws.s3.putObject(params, function (err, data) {
            if (err) {
              console.log("Error uploading data: ", err);
              callback(err);
            } else {
              console.log("Successfully uploaded data to s3");
              // Save the photo reference to DB
              var p = new Photo({
                user_id: req.user._id,
                place_id: req.body.place_id,
                key: filename,
                timestamp: timestamp
              });
              p.save(function(err) {
                if (err) {
                  // Error saving to DB
                  callback(err);
                } else {
                  // Success!
                  callback(null);
                }
              });
            }
          });
        });
      });

      // execute promises in parallel and collect results
      _async.parallel(calls, function(err, results) {
        if(err) {
          return error.InternalServerError(res);
        }
        if(!results) return error.NotFound(res);
        return success.Created(res, "Photos");
      });
    });
  },
  deleteById: function(req, res) {
    // user must be authenticated to delete photo
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary params
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }

    Photo.findById(req.params.id, function(err, photo) {
      if(err) return error.InternalServerError(res);
      if(!photo) return error.BadRequest(res, 'id');  // ensure photo exists

      // ensure user owns the photo to be deleted
      if(String(photo.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      // all ok, delete
      deleter.photo(res, req.params.id);
    });
  }
}
