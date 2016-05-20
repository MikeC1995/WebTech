'use strict';

var express = require('express');
var multer = require('multer');
var router = express.Router();
var success = require('./responses/successes.js');

module.exports = function(app) {
  router.route('/').get(function(req, res) {
    res.send("Welcome to the Tripmappr API!");
  });

  // Logout by destroying session
  router.route('/logout').get(function(req, res) {
    req.session.destroy();
    req.logout();
    return success.OK(res);
  });

  // Get user data
  var users = require('./routes/users.js');
  router.route('/users/me')
    .get(users.getMe);        // Get the authenticated user
  router.route('/users/:id')
    .get(users.getById);      // Get a specific user's data

  // Register routes
  var trips = require('./routes/trips.js');
  router.route('/trips')
    .get(trips.get)
    .post(trips.post);
  router.route('/trips/:id')
    .get(trips.getById)
    .delete(trips.deleteById)
    .put(trips.updateById);

  var places = require('./routes/places.js');
  router.route('/places')
    .get(places.get)
    .post(places.post);
  router.route('/places/:id')
    .get(places.getById)
    .delete(places.deleteById)
    .put(places.updateById);

  // Use multer middleware to attach 'files' object to request body
  var photos = require('./routes/photos.js');
  var attach = multer({ limits: { fileSize: 10*1024*1024 } }).any();
  router.use('/photos', attach);
  router.route('/photos')
    .get(photos.get)
    .post(photos.post);
  router.route('/photos/:id')
    .get(photos.getById)
    .delete(photos.deleteById);

  // TODO: implement DeleteById, and Delete using array of ids
  // Can't use HTTP verb DELETE as body required to specify resources to delete.
  // This could be too long to specify in the URI itself.
  // Instead, using a seperate end point with the POST verb.
  //router.route('/photos/delete')
  //  .post(photos.delete);

  return router;
}
