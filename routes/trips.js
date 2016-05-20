'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Trip = require('../models/trip.js');
var deleter = require('../helpers/delete.js');

module.exports = {
  get:  function(req, res) {
    // TODO: ensure allowed to return this user's data
    var uid;
    if(req.query.user_id !== undefined) {
      uid = req.query.user_id;
    } else if(req.isAuthenticated() && req.user._id !== undefined) {
      uid = req.user._id;
    }

    Trip.find({ user_id: uid }, function(err, trips) {
      if(err) return error.InternalServerError(res);
      return success.OK(res, trips);
    });
  },
  getById: function(req, res) {
    // TODO: ensure user allowed to see this trip
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    } else {
      Trip.findById(req.params.id, function(err, trip) {
        if(err) return error.InternalServerError(res);
        return success.OK(res, trip);
      });
    }
  },
  post: function(req, res) {
    if(!req.isAuthenticated() || req.user._id === undefined) {
      return error.Forbidden(res);
    }

    if(req.body.name === undefined) {
      return error.BadRequest(res, 'name');
    }
    if(req.body.colour === undefined) {
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
    // TODO: ensure user allowed to delete this trip
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    } else {
      deleter.trip(res, req.params.id);
    }
  },
  updateById: function(req, res) {
    // TODO: ensure user allowed to update this trip
    if(req.params.id === undefined) {
      return error.BadRequest(res, 'id');
    }
    if(req.body.name === undefined) {
      return error.BadRequest(res, 'name');
    }
    if(req.body.colour === undefined) {
      return error.BadRequest(res, 'colour');
    }
    // Rename trip
    Trip.findOneAndUpdate({
      _id: req.params.id
    }, {
      name: req.body.name,
      colour: req.body.colour
    }, { upsert: false }, function(err, trip) {
        if (err) return error.InternalServerError(res);
        return success.OK(res);
    });
  }
}
