'use strict';

module.exports = function(app) {
  var express = require('express');
  var multer = require('multer');
  var router = express.Router();

  // Test route
  router.route('/').get(function(req, res) {
    res.send("WOOO! API!!");
  });

  // Register routes
  var trips = require('./routes/trips.js');
  router.route('/trips')
    .get(trips.get)
    .post(trips.post)
    .delete(trips.delete)
    .put(trips.put);

  var places = require('./routes/places.js');
  router.route('/trips/places')
    .get(places.get)
    .post(places.post)
    .delete(places.delete)
    .put(places.put);

  // Use multer middleware to attach 'files' object to request body
  var photos = require('./routes/photos.js');
  var attach = multer({limits: {fileSize:10*1024*1024}}).any();
  router.use('/photos', attach);
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
