'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var multer = require('multer'); //for handling multipart form data
var Photo = require('../models/photo.js');

module.exports = {
  get:  function(req, res) {
    if(req.query.place_id === undefined) {
      return error.BadRequest(res, 'place_id');
    }
    var params = {
      place_id: req.query.place_id
    };

    if(req.query.timebefore !== undefined) {
      console.log("Fetch before " + req.query.timebefore);
      params.timestamp = { $lt: req.query.timebefore };
    } else if(req.query.timeafter !== undefined) {
      console.log("Fetch after " + req.query.timeafter);
      params.timestamp = { $gt: req.query.timeafter };
    } else {
      console.log("Fetch all");
    }
    Photo.find(params)
      .sort({'timestamp': -1})
      .limit(50)
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
    // of the form: <place_id>-<timedatestamp>.<extension>
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
        var filename = req.body.place_id + "-" + timestamp + "." + extension;

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
  }
}
