var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  name: String,
  colour: String
});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
