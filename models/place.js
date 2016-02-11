var mongoose = require('mongoose');

var placeSchema = new mongoose.Schema({
  name: String,
  trip_id: String
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;
