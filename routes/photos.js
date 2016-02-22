'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var multer = require('multer'); //for handling multipart form data
var fs = require('fs');
var imageurls = require('../helpers/image-urls.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');

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

    // Client should recieve the urls where it can access the photos, (not the raw filenames)
    function sendUrls(photos) {
      for(var i = 0; i < photos.length; i++) {
        var url = imageurls.nameToPath(photos[i].filename);
        photos[i].filename = url;
      }
      return success.OK(res, photos);
    }
  },
  post: function(req, res) {
    // Store the uploaded file in the uploads folder under a name
    // of the form: <place_id>-<timedatestamp>-<originalname>-<timestamp>.<extension>
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
        var originalname = file.originalname.split('.').slice(0, -1)[0].replace(/ /g,''); // file extension + whitespace removed
        var filename = req.body.place_id + "-" + timestamp + "-" + originalname + "-" + timestamp + "." + extension;

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
    // Photos array should be attached to request as body
    if(req.body !== undefined) {
      // Photo filenames on the client are the urls it uses to access them
      // Must convert these paths to the actual filenames
      for(var i = 0; i < req.body.length; i++) {
        req.body[i].filename = imageurls.pathToName(req.body[i].filename);
      }
      deleter.photos(res, req.body);
    } else {
      return error.BadRequest(res, "body");
    }
  }
}
