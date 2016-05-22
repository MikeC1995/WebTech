'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Trip = require('../models/trip.js');
var deleter = require('../helpers/delete.js');
var userLists = require('../helpers/user-lists.js');

module.exports = {
  get:  function(req, res) {
    new Promise(function(resolve, reject) {
      if(req.isAuthenticated()) {
        // authenticated
        if(!req.query.user_id) {
          // no requested query: return trips for self
          resolve(req.user._id);
        } else {
          // requested query user could be self:
          if(req.user._id == req.query.user_id) {
            resolve(req.user._id);
          }

          // otherwise requested query user must be in whitelist or friendlist
          userLists.allowedList(req.user).then(function(users) {
            for(var i = 0; i < users.length; i++) {
              if(users[i]._id == req.query.user_id) {
                resolve(req.query.user_id);
              }
            }
            reject();
          }, reject);
        }
      } else {
        // not authenticated: requested user must be in whitelist
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(users[i]._id == req.query.user_id) {
              resolve(req.query.user_id);
            }
          }
          reject();
        }, reject);
      }
    }).then(function(uid) {
      // authorised request: return trip
      Trip.find({ user_id: uid }, function(err, trips) {
        if(err) return error.InternalServerError(res);
        if(!trips) return error.NotFound(res);
        return success.OK(res, trips);
      });
    }, function() {
      return error.Forbidden(res);
    });
  },
  getById: function(req, res) {
    if(!req.params.id) {
      return error.BadRequest(res, "id");
    }
    new Promise(function(resolve, reject) {
      if(req.isAuthenticated()) {
        // requested query user could be self:
        if(req.user._id == req.params.id) {
          resolve(req.user._id);
        }
        // otherwise requested query user must be in whitelist or friendlist
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(users[i]._id == req.params.id) {
              resolve(req.params.id);
            }
          }
          reject();
        }, reject);
      } else {
        // not authenticated: requested user must be in whitelist
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(users[i]._id == req.params.id) {
              resolve(req.params.id);
            }
          }
          reject();
        }, reject);
      }
    }).then(function(uid) {
      // authorised request
      Trip.findById(req.params.id, function(err, trip) {
        if(err) return error.InternalServerError(res);
        if(!trip) return error.NotFound(res);
        return success.OK(res, trip);
      });
    }, function() {
      return error.Forbidden(res);
    });
  },
  post: function(req, res) {
    // must be authenticated to add a trip
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // Ensure correct params are attached
    if(!req.body.name) {
      return error.BadRequest(res, 'name');
    }
    if(!req.body.colour) {
      return error.BadRequest(res, 'colour');
    }
    var t = new Trip({
      user_id: req.user._id,
      name: req.body.name,
      colour: req.body.colour
    });
    t.save(function(err) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Trip');
    });
  },
  deleteById: function(req, res) {
    // must be authenticated to delete a trip
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }
    // must specify trip id to delete
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }

    Trip.findById(req.params.id, function(err, trip) {
      if(err) return error.InternalServerError(res);
      if(!trip) return error.NotFound(res);

      // trip must belong to authenticated user
      if(String(trip.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      // all ok, can delete
      deleter.trip(res, req.params.id);
    });
  },
  updateById: function(req, res) {
    // must be authenticated to update a trip
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary parameters are attached
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }
    if(!req.body.name) {
      return error.BadRequest(res, 'name');
    }
    if(!req.body.colour) {
      return error.BadRequest(res, 'colour');
    }

    // Rename trip
    Trip.findOneAndUpdate({
      _id: req.params.id,
      user_id: req.user._id   // must belong to the authenticated user
    }, {
      name: req.body.name,
      colour: req.body.colour
    }, { upsert: false }, function(err, trip) {
        if (err) return error.InternalServerError(res);
        if(!trip) return error.NotFound(res);
        return success.OK(res);
    });
  }
}
