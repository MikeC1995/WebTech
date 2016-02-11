'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Place = require('../models/place.js');

module.exports = {
  get:  function(req, res) {
    Place.find({}, function(err, places) {
      if(err) return error.InternalServerError(res);
      return success.OK(res, places);
    });
  },
  post: function(req, res) {
    if(req.body.name === undefined) {
      return error.BadRequest(res, 'name');
    } else if(req.body.trip_id === undefined) {
      return error.BadRequest(res, 'trip_id');
    }
    var t = new Place({ name: req.body.name, trip_id: req.body.trip_id });
    t.save(function(err) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Place');
    });
  }
}
