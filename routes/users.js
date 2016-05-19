'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var User = require('../models/user.js');

module.exports = {
  get:  function(req, res) {
    var uid;
    if(req.query.user_id !== undefined) {
      uid = req.query.user_id;
    } else if(req.user._id !== undefined) {
      uid = req.user._id;
    } else {
      return error.BadRequest(res, 'user_id');
    }

    User.findById(uid, function(err, user) {
      if(err) return error.InternalServerError(res);
      return success.OK(res, user);
    });
  }
}
