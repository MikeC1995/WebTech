'use strict';

var error = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Place = require('../models/place.js');

module.exports = {
  get:  function(req, res) {
    var params = {};
    if(req.query.trip_id !== undefined) {
      params.trip_id = req.query.trip_id;
    }
    Place.find(params, function(err, places) {
      if(err) return error.InternalServerError(res);
      return success.OK(res, places);
    });
  },
  post: function(req, res) {
    // TODO: cleaner mongoose method for validating POST body against schema?
    if(req.body.trip_id === undefined) {
      return error.BadRequest(res, 'trip_id');
    } else if(req.body.location === undefined) {  // TODO: children of Location
      return error.BadRequest(res, 'location');
    } else if(req.body.from_date === undefined) {
      return error.BadRequest(res, 'from_date');
    } else if(req.body.to_date === undefined) {
      return error.BadRequest(res, 'to_date');
    }
    var t = new Place({
      trip_id: req.body.trip_id,
      location: req.body.location,
      from_date: req.body.from_date,
      to_date: req.body.to_date
    });
    t.save(function(err) {
      if (err) return error.InternalServerError(res);
      return success.Created(res, 'Place');
    });
  }
}
