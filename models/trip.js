// grab the things we need
var mongoose = require('mongoose');

// create a schema
var tripSchema = new mongoose.Schema({
  name: String,
  created_on: Date,
  updated_on: Date
});

// the schema is useless so far
// we need to create a model using it
var Trip = mongoose.model('Trip', tripSchema);

// make this available to our users in our Node applications
module.exports = Trip;
