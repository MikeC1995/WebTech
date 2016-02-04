var err = require('../responses/errors.js');
var success = require('../responses/successes.js');
var Trip = require('../models/trip.js');

module.exports = {
  get:  function(req, res) {
    Trip.find({}, function(err, trips) {
      if(err) return res.send(new err.InternalServerError());
      return res.send(new success.OK(trips));
    });
  },
  post: function(req, res) {
    if(req.body.name === undefined) {
      return res.send(new err.BadRequest('name'));
    }
    var t = new Trip({ name: req.body.name });
    t.save(function(err) {
      if (err) return res.send(new err.InternalServerError());
      return res.send(new success.Created('Trip'));
    });
  }
}
