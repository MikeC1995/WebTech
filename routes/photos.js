'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var multer = require('multer'); //for handling multipart form data

module.exports = {
  get:  function(req, res) {
    console.log("GET photos");
  },
  post: function(req, res) {
    // Store the uploaded file in the uploads folder under a name
    // of the form: <trip_id>-<place_id>-<timedatestamp>.<extension>
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        if(req.body.trip_id === undefined) {
          cb("trip_id");   // upload error
        } else if(req.body.place_id === undefined) {
          cb("place_id");   // upload error
        }
        var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
        var filename = req.body.trip_id + "-" + req.body.place_id + "-" + Date.now() + "." + extension;
        cb(null, filename);
      }
    });

    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
      if(err) {
        return error.BadRequest(res, err);
      }
      return success.Created(res, "photos");
    });
  }
}
