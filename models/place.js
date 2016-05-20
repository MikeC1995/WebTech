var mongoose = require('mongoose');
// Models
var Trip = require('./trip.js');

var Location = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number
});

var placeSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  trip_id: mongoose.Schema.Types.ObjectId,
  location: Location,
  from_date: Date,
  to_date: Date
});

// Validate that trip_id reference really exists
placeSchema.path('trip_id').validate(function (value, respond) {
  Trip.findOne({_id: value}, function (err, result) {
    if (err || !result) {
      respond(false);
    } else {
      respond(true);
    }
  });
}, 'Trip doesn\'t exist!');


var Place = mongoose.model('Place', placeSchema);

module.exports = Place;
