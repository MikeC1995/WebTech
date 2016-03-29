'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Trip = require('../models/trip.js');
var deleter = require('../helpers/delete.js');

module.exports = {
  get:  function(req, res) {
    Trip.find({}, function(err, trips) {
      if(err) return error.InternalServerError(res);
      return success.OK(res, trips);
    });
  },
  post: function(req, res) {
    if(req.body.name === undefined) {
      return error.BadRequest(res, 'name');
    }
    if(req.body.colour === undefined) {
      return error.BadRequest(res, 'colour');
    }
    var t = new Trip({ name: req.body.name, colour: req.body.colour });
    t.save(function(err) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Trip');
    });
  },
  delete: function(req, res) {
    if(req.query.trip_id === undefined) {
      return error.BadRequest(res, 'trip_id');
    } else {
      deleter.trip(res, req.query.trip_id);
    }
  }
}
