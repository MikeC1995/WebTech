'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Trip = require('../models/trip.js');

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
    var t = new Trip({ name: req.body.name });
    t.save(function(err) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Trip');
    });
  }
}
