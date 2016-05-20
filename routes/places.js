'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Place = require('../models/place.js');
var Photo = require('../models/photo.js');
var deleter = require('../helpers/delete.js');

module.exports = {
  get:  function(req, res) {
    if(req.query.trip_id !== undefined) {
      // Get by trip id
      // TODO: ensure user allowed to get places for this trip
      Place.find({ trip_id: req.query.trip_id }, function(err, places) {
        if(err) return error.InternalServerError(res);
        return success.OK(res, places);
      });
    } else {
      var uid;
      if(req.query.user_id !== undefined) {
        // TODO: ensure user allowed to get places for this user
        uid = req.query.user_id;
      } else if(req.isAuthenticated() && req.user._id !== undefined) {
        uid = req.user._id;
      }
      Place.find({ user_id: uid }, function(err, places) {
        if(err) return error.InternalServerError(res);
        return success.OK(res, places);
      });
    }
  },
  getById: function(req, res) {
    // TODO: ensure user allowed to see this place
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    } else {
      Place.findById(req.params.id, function(err, place) {
        if(err) return error.InternalServerError(res);
        return success.OK(res, place);
      });
    }
  },
  post: function(req, res) {
    // TODO: ensure user owns the trip this place is being posted to
    if(!req.isAuthenticated() || req.user._id === undefined) {
      return error.Forbidden(res);
    }

    if(req.body.trip_id === undefined) {
      return error.BadRequest(res, 'trip_id');
    }
    if(req.body.location === undefined || req.body.location.lat === undefined ||
       req.body.location.lng === undefined) {
      return error.BadRequest(res, 'location');
    }
    if(req.body.from_date === undefined) {
      return error.BadRequest(res, 'from_date');
    }
    if(req.body.to_date === undefined) {
      return error.BadRequest(res, 'to_date');
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
  },
  deleteById: function(req, res) {
    // TODO: ensure user allowed to delete this place
    if(req.params.id !== undefined) {
      deleter.place(res, req.params.id);
    } else {
      return error.BadRequest(res, "id");
    }
  },
  updateById: function(req, res) {
    // TODO: ensure user allowed to update this place
    // TODO: ensure user allowed to update to specified trip_id
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    }
    if(req.body.trip_id === undefined) {
      return error.BadRequest(res, 'trip_id');
    }
    if(req.body.location === undefined || req.body.location.lat === undefined ||
       req.body.location.lng === undefined) {
      return error.BadRequest(res, 'location');
    }
    if(req.body.from_date === undefined) {
      return error.BadRequest(res, 'from_date');
    }
    if(req.body.to_date === undefined) {
      return error.BadRequest(res, 'to_date');
    }
    Place.findOneAndUpdate({
      _id: req.params.id
    }, {
      trip_id: req.body.trip_id,
      location: req.body.location,
      from_date: req.body.from_date,
      to_date: req.body.to_date
    }, { upsert: false }, function(err, place) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Place');
    });
  }
}
