var mongoose = require('mongoose');
// Models
var Place = require('./place.js');

var photoSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  place_id: mongoose.Schema.Types.ObjectId,
  key: String,
  timestamp: Date
});

// Validate that place_id reference really exists
photoSchema.path('place_id').validate(function (value, respond) {
  Place.findOne({_id: value}, function (err, result) {
    if (err || !result) {
      respond(false);
    } else {
      respond(true);
    }
  });
}, 'Place doesn\'t exist!');


var Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
