var mongoose = require('mongoose');

var Location = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number
});

var placeSchema = new mongoose.Schema({
  trip_id: String,
  location: Location,
  from_date: Date,
  to_date: Date
});

var Place = mongoose.model('Place', placeSchema);

module.exports = Place;
