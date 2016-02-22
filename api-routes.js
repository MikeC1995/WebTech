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

  var photos = require('./routes/photos.js');
  router.route('/photos')
    .get(photos.get)
    .post(photos.post);

  // Can't use HTTP verb DELETE as body required to specify resources to delete.
  // This could be too long to specify in the URI itself.
  // Instead, using a seperate end point with the POST verb.
  router.route('/photos/delete')
    .post(photos.delete);

  return router;
}
