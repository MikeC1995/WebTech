'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var multer = require('multer'); //for handling multipart form data

module.exports = {
  get:  function(req, res) {
    console.log("GET photos");
  },
  post: function(req, res) {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
      }
    });

    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function(err) {
      if(err) {
        console.log("upload error");
        res.json({error_code:1,err_desc:err});
        return;
      }
      res.json({error_code:0,err_desc:null});
    });
  }
}
