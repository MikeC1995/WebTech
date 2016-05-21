'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var User = require('../models/user.js');
var permissions = require('../helpers/permissions.js');

module.exports = {
  getMe:  function(req, res) {
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    User.findById(req.user._id, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);
      return success.OK(res, user);
    });
  },
  getById: function(req, res) {
    if(!req.params.id) {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findById(req.params.id, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);

      // If not authenticated user must be in whitelist
      if(!req.isAuthenticated()) {
        permissions.isInWhitelist(user).then(function() {
          var allowedUser = {
            _id: user._id,
            facebookID: user.facebookID,
            name: user.name,
            email: user.email,
            created: user.created
          }
          return success.OK(res, allowedUser);
        }, function() {
          return error.Forbidden(res);
        });
      } else {  // Authenticated:
        // This is authenticated user themself
        if(req.user._id == req.params.id) {
          return success.OK(res, user);
        }
        // The user is in the authenticated user's friend list
        permissions.isInFriendList(req.user, user).then(function() {
          var allowedUser = {
            _id: user._id,
            facebookID: user.facebookID,
            name: user.name,
            email: user.email,
            created: user.created
          }
          return success.OK(res, allowedUser);
        }, function() {
          return error.Forbidden(res);
        });
      }
    });
  },
  getByFacebookId: function(req, res) {
    if(!req.params.id) {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findOne({ facebookID: req.params.id }, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);

      // If not authenticated user must be in whitelist
      if(!req.isAuthenticated()) {
        permissions.isInWhitelist(user).then(function() {
          var allowedUser = {
            _id: user._id,
            facebookID: user.facebookID,
            name: user.name,
            email: user.email,
            created: user.created
          }
          return success.OK(res, allowedUser);
        }, function() {
          return error.Forbidden(res);
        });
      } else {  // Authenticated:
        // This is authenticated user themself
        if(req.user.facebookID == req.params.id) {
          return success.OK(res, user);
        }
        // The user is in the authenticated user's friend list
        permissions.isInFriendList(req.user, user).then(function() {
          var allowedUser = {
            _id: user._id,
            facebookID: user.facebookID,
            name: user.name,
            email: user.email,
            created: user.created
          }
          return success.OK(res, allowedUser);
        }, function() {
          return error.Forbidden(res);
        });
      }
    });
  },
  // Update whether this user is public or not
  updateMe: function(req, res) {
    if(!req.isAuthenticated() || !req.user._id) {
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
