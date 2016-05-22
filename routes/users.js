'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var User = require('../models/user.js');
var userLists = require('../helpers/user-lists.js');

module.exports = {
  getMe:  function(req, res) {
    // Must be authenticated
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    User.findById(req.user._id, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);
      return success.OK(res, user);
    });
  },
  // not auth: whitelist
  // auth: me, whitelist, friendlist
  getById: function(req, res) {
    // Must specify id
    if(!req.params.id) {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findById(req.params.id, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);

      // If not authenticated user must be in whitelist
      if(!req.isAuthenticated()) {
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(req.params.id)) {
              var allowedUser = {
                _id: user._id,
                facebookID: user.facebookID,
                name: user.name,
                email: user.email,
                created: user.created
              }
              return success.OK(res, allowedUser);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.Forbidden(res);
        });
      } else {  // Authenticated:
        // This is authenticated user themself
        if(String(req.user._id) == String(req.params.id)) {
          return success.OK(res, user);
        }

        // The user is a friend of the authenticated user or in the whitelist
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(req.params.id)) {
              var allowedUser = {
                _id: user._id,
                facebookID: user.facebookID,
                name: user.name,
                email: user.email,
                created: user.created
              }
              return success.OK(res, allowedUser);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.Forbidden(res);
        });
      }
    });
  },
  getByFacebookId: function(req, res) {
    // Must specify id
    if(!req.params.id) {
      return error.BadRequest(res, 'Missing user ID');
    }

    User.findOne({ facebookID: req.params.id }, function(err, user) {
      if(err) return error.InternalServerError(res);
      if(!user) return error.NotFound(res);

      // If not authenticated user must be in whitelist
      if(!req.isAuthenticated()) {
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i].facebookID) == String(req.params.id)) {
              var allowedUser = {
                _id: user._id,
                facebookID: user.facebookID,
                name: user.name,
                email: user.email,
                created: user.created
              }
              return success.OK(res, allowedUser);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.Forbidden(res);
        });
      } else {  // Authenticated:
        // This is authenticated user themself
        if(String(req.user.facebookID) == String(req.params.id)) {
          return success.OK(res, user);
        }
        // The user is a friend of the authenticated user or in the whitelist
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i].facebookID) == String(req.params.id)) {
              var allowedUser = {
                _id: user._id,
                facebookID: user.facebookID,
                name: user.name,
                email: user.email,
                created: user.created
              }
              return success.OK(res, allowedUser);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.Forbidden(res);
        });
      }
    });
  },
  // Update whether this user is public or not
  updateMe: function(req, res) {
    // Updated the authenticated user only
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
