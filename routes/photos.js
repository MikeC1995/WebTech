'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var fs = require('fs');
var imageurls = require('../helpers/image-urls.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');
var aws = require('../config/aws.js');

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
      var response = [];
      for(var i = 0; i < photos.length; i++) {
        var params = { Bucket: aws.s3bucket, Key: photos[i].key };
        var url = aws.s3.getSignedUrl('getObject', params);
        var photo = {
          url: url,
          _id: photos[i]._id
        }
        response.push(photo);
      }
      return success.OK(res, response);
    }
  },
  post: function(req, res) {
    // Upload each file to AWS S3 and store filename in db
    for(var i = 0; i < req.files.length; i++) {
      var file = req.files[i];

      // Save under filename of the form: <place_id>-<timedatestamp>-<originalname>.<extension>
      var timestamp = Date.now();
      var extension = file.originalname.split('.')[file.originalname.split('.').length -1];
      var originalname = file.originalname.split('.').slice(0, -1)[0].replace(/ /g,''); // file extension + whitespace removed
      var filename = req.body.place_id + "-" + timestamp + "-" + originalname + "." + extension;

      // Save to S3
      var params = {
        Bucket: aws.s3bucket,
        Key: filename,
        Body: file.buffer
      };
      aws.s3.putObject(params, function (err, data) {
        if (err) {
          // TODO return error to client
          console.log("Error uploading data: ", err);
        } else {
          console.log("Successfully uploaded data to myBucket/myKey");
          // Save the photo reference to DB
          var p = new Photo({
            place_id: req.body.place_id,
            key: filename,
            timestamp: timestamp
          });
          p.save(function(err) {
            if (err) {
              // Error saving to DB
              return error.InternalServerError(res, "Error saving to database.")
            } else {
              // Success!
              return success.Created(res, "photos");
            }
          });
        }
      });
    }
  },
  delete: function(req, res) {
    // Photos array should be attached to request as body
    if(req.body !== undefined) {
      deleter.photos(res, req.body);
    } else {
      return error.BadRequest(res, "body");
    }
  }
}
