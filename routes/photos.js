'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var fs = require('fs');
var imageurls = require('../helpers/image-urls.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');
var aws = require('../config/aws.js');
var _async = require('async');
var gm = require('gm').subClass({
    imageMagick: true
});

module.exports = {
  get:  function(req, res) {
    if(req.query.place_id === undefined) {
      return error.BadRequest(res, 'place_id');
    }

    // TODO: ensure user is allowed to get photos for this place
    var params = {
      place_id: req.query.place_id
    };
    // default limit is 50
    var limit = 50;
    // If specified, limit number of returned results
    if(req.query.limit !== undefined) {
      limit = req.query.limit;
    }

    // One of timebefore or timeafter can be specified, only photos
    // with a timestamp before/after this date will be returned
    if(req.query.timebefore !== undefined) {
      params.timestamp = { $lt: req.query.timebefore };
    } else if(req.query.timeafter !== undefined) {
      params.timestamp = { $gt: req.query.timeafter };
    }
    Photo.find(params)
      .sort({'timestamp': -1})
      .limit(Number(limit))
      .exec(
        function(err, photos) {
          if(err) return error.InternalServerError(res);
          sendUrls(photos);
        }
      );

    // Client should recieve the urls where it can access the photos, (not the raw filenames)
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
  },
  getById: function(req, res) {
    // TODO: ensure user allowed to get this photo
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    } else {
      Photo.findById(req.params.id, function(err, photo) {
        if(err) return error.InternalServerError(res);
        return success.OK(res, photo);
      });
    }
  },
  post: function(req, res) {
    // TODO: ensure user owns the place this photo is being posted to
    if(!req.isAuthenticated() || req.user._id === undefined) {
      return error.Forbidden(res);
    }
    if(req.body.place_id === undefined) {
      return error.BadRequest(res, 'place_id');
    }

    var calls = [];
    // Upload each file to AWS S3 and store filename in db
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
            console.log("Successfully uploaded data to myBucket/myKey");
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

    _async.parallel(calls, function(err, results) {
      if(err) {
        return error.InternalServerError(res, "Unable to add photos");
      } else {
        return success.Created(res, "Photos");
      }
    });
  },
  deleteById: function(req, res) {
    // TODO: ensure the user is allowed to delete this photo
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    } else {
      deleter.photo(res, req.params.id);
    }
  }
}
