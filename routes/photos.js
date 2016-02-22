'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var multer = require('multer'); //for handling multipart form data
var fs = require('fs');
var Photo = require('../models/photo.js');

module.exports = {
  get:  function(req, res) {
    if(req.query.place_id === undefined) {
      return error.BadRequest(res, 'place_id');
    }
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

    function sendUrls(photos) {
      for(var i = 0; i < photos.length; i++) {
        var url = "/uploads/" + photos[i].filename;
        photos[i].filename = url;
      }
      return success.OK(res, photos);
    }
  },
  post: function(req, res) {
    // Store the uploaded file in the uploads folder under a name
    // of the form: <place_id>-<timedatestamp>-<originalname>.<extension>
    // NOTE: the original name is required to ensure uniqueness in filenames!
    // Very fast uploads means Date.now() doesnt produce a unique filename (at least when running locally)
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        if(req.body.place_id === undefined) {
          cb("place_id");   // upload error
        }
        var timestamp = Date.now();
        var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
        var filename = req.body.place_id + "-" + timestamp + "-" + file.originalname + "." + extension;

        // Save the photo reference to DB
        var p = new Photo({
          place_id: req.body.place_id,
          filename: filename,
          timestamp: timestamp
        });
        p.save(function(err) {
          // Error saving to DB
          if (err) return error.InternalServerError(res);
          // Success: save the image under filename
          cb(null, filename);
        });
      }
    });

    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
      // Error building filename due to missing params
      if(err) return error.BadRequest(res, err);
      // Successfully saved image
      return success.Created(res, "photos");
    });
  },
  delete: function(req, res) {

    function deletePhotos(photos, callback) {
      var i = photos.length;
      photos.forEach(function(photo) {
        // Delete from database
        Photo.find({_id: photo._id}).remove(function(err) {
          if(err) {
            callback(err);
            return;
          }
          // Delete from filesystem (TODO: AWS S3)
          fs.unlink('./' + photo.filename, function(err) {
            i--;
            if (err) {
              callback(err);
              return;
            } else if (i <= 0) {
              callback(null);
            }
          });
        });
      });
    }

    deletePhotos(req.body, function(err) {
      if (err) {
        return error.InternalServerError(res, 'Unable to delete files.');
      } else {
        return success.OK(res);
      }
    });
  }
}
