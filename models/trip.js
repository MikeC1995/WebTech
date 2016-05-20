var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  colour: String
});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
