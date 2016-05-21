'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var User = require('../models/user.js');

module.exports = {
  getMe:  function(req, res) {
    var uid;
    if(req.isAuthenticated() && req.user._id) {
      uid = req.user._id;
    } else {
      return error.Forbidden(res);
    }

    User.findById(uid, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);
      return success.OK(res, user);
    });
  },
  getById: function(req, res) {
    // TODO: ensure user is allowed to get this particular user's data
    // TODO: limit what data is sent back!

    var uid;
    if(req.params.id !== undefined) {
      uid = req.params.id;
    } else {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findById(uid, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);
      return success.OK(res, user);
    });
  },
  getByFacebookId: function(req, res) {
    // TODO: ensure user is allowed to get this particular user's data
    // TODO: limit what data is sent back!

    var uid;
    if(req.params.id !== undefined) {
      uid = req.params.id;
    } else {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findOne({ facebookID: uid }, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);
      return success.OK(res, user);
    });
  },
  updateMe: function(req, res) {
    if(!req.isAuthenticated() || req.user._id === undefined) {
      return error.Forbidden(res);
    }
    if(!req.body.public) {
      return error.BadRequest(res, 'public');
    }

    User.findOneAndUpdate({
      _id: req.user._id
    }, {
      public: req.body.public
    }, { upsert: false }, function(err, user) {
        if (err) return error.InternalServerError(res);
        if(!user) return error.NotFound(res);
        return success.OK(res, user);
    });
  }
}
