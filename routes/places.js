'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Place = require('../models/place.js');
var Trip = require('../models/trip.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');
var userLists = require('../helpers/user-lists.js');

module.exports = {
  get:  function(req, res) {
    new Promise(function(resolve, reject) {
      if(req.query.trip_id) {
        // get place by trip_id
        Place.find({ trip_id: req.query.trip_id }, function(err, places) {
          if(err) reject();
          resolve(places);
        });
      } else if(req.query.user_id) {
        // get place by user_id
        Place.find({ user_id: req.query.user_id }, function(err, places) {
          if(err) reject();
          resolve(places);
        });
      } else if(req.isAuthenticated() && req.user._id) {
        // get places for authenticated user
        Place.find({ user_id: req.user._id }, function(err, places) {
          if(err) reject();
          resolve(places);
        });
      } else {
        // bad parameters
        reject(true);
      }
    }).then(function(places) {
      if(!places) return error.NotFound(res);
      if(places.length == 0) return success.OK(res, places);

      if(req.isAuthenticated() && req.user._id) {
        // authenticated

        // the place owner is the authenticated user themself
        if(String(places[0].user_id) == String(req.user._id)) {
          return success.OK(res, places);
        }

        // place owner must be on whitelist or friendlist
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(places[0].user_id)) {
              return success.OK(res, places);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      } else {
        // not authenticated, place owner must be on whitelist
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(places[0].user_id)) {
              return success.OK(res, places);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      }
    }, function(badRequest) {
      if(badRequest) return error.BadRequest(res);
      return error.InternalServerError(res);
    });
  },
  getById: function(req, res) {
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }

    Place.findById(req.params.id, function(err, place) {
      if(err) return error.InternalServerError(res);
      if(!place) return error.NotFound(res);

      if(req.isAuthenticated() && req.user._id) {
        // authenticated

        // if place owner is the authenticated user themself
        if(String(place.user_id )== String(req.user._id)) {
          return success.OK(res, place);
        }

        // otherwise place owner must be on whitelist or friendlist
        userLists.allowedList(req.user).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(place.user_id)) {
              return success.OK(res, place);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      } else {
        // not authenticated, place owner must be on whitelist
        userLists.whitelist().then(function(users) {
          for(var i = 0; i < users.length; i++) {
            if(String(users[i]._id) == String(place.user_id)) {
              return success.OK(res, place);
            }
          }
          return error.Forbidden(res);
        }, function() {
          return error.InternalServerError(res);
        });
      }
    });
  },
  post: function(req, res) {
    // user must be authenticated to add a place
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary params
    if(!req.body.trip_id) {
      return error.BadRequest(res, 'trip_id');
    }
    if(!req.body.location || !req.body.location.lat || !req.body.location.lng) {
      return error.BadRequest(res, 'location');
    }
    if(!req.body.from_date) {
      return error.BadRequest(res, 'from_date');
    }
    if(!req.body.to_date) {
      return error.BadRequest(res, 'to_date');
    }

    Trip.findById(req.body.trip_id, function(err, trip) {
      if(err) return error.InternalServerError(res);
      if(!trip) return error.BadRequest(res, 'trip_id');

      // ensure authenticated user owns the trip the place will be posted to
      if(String(trip.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      var p = new Place({
        user_id: req.user._id,
        trip_id: req.body.trip_id,
        location: req.body.location,
        from_date: req.body.from_date,
        to_date: req.body.to_date
      });
      p.save(function(err) {
        if (err) return error.InternalServerError(res);
        return success.Created(res, 'Place');
      });
    });
  },
  deleteById: function(req, res) {
    // user must be authenticated to delete a place
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary params
    if(!req.params.id) {
      return error.BadRequest(res, "id");
    }

    Place.findById(req.params.id, function(err, place) {
      if(err) return error.InternalServerError(res);
      if(!place) return error.BadRequest(res, 'id');

      // ensure user owns the place to delete
      if(String(place.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      // all ok
      deleter.place(res, req.params.id);
    });
  },
  updateById: function(req, res) {
    // user must be authenticated to delete a place
    if(!req.isAuthenticated() || !req.user._id) {
      return error.Forbidden(res);
    }

    // ensure necessary params
    if(!req.params.id) {
      return error.BadRequest(res, 'id');
    }
    if(!req.body.trip_id) {
      return error.BadRequest(res, 'trip_id');
    }
    if(!req.body.location || !req.body.location.lat || !req.body.location.lng) {
      return error.BadRequest(res, 'location');
    }
    if(!req.body.from_date) {
      return error.BadRequest(res, 'from_date');
    }
    if(!req.body.to_date) {
      return error.BadRequest(res, 'to_date');
    }

    Trip.findById(req.body.trip_id, function(err, trip) {
      if(err) return error.InternalServerError(res);
      if(!trip) return error.BadRequest(res, 'trip_id');  // ensure new parent trip exists

      // ensure user owns the new parent trip for the place
      if(String(trip.user_id) != String(req.user._id)) {
        return error.Forbidden(res);
      }

      Place.findOneAndUpdate({
        _id: req.params.id,
        user_id: req.user._id   // ensure user owns the place to be updated
      }, {
        trip_id: req.body.trip_id,
        location: req.body.location,
        from_date: req.body.from_date,
        to_date: req.body.to_date
      }, { upsert: false }, function(err, place) {
        if (err) return error.InternalServerError(res);
        return success.Created(res, 'Place');
      });
    });
  }
}
