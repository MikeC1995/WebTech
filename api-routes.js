'use strict';

module.exports = function(app) {
  var express = require('express');
  var router = express.Router();

  // Test route
  router.route('/').get(function(req, res) {
    res.send("WOOO! API!!");
  });

  // Register routes
  var trips = require('./routes/trips.js');
  router.route('/trips')
    .get(trips.get)
    .post(trips.post);

  var places = require('./routes/places.js');
  router.route('/trips/places')
    .get(places.get)
    .post(places.post);

  return router;
}
