var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  facebookID: Number,
  name: String,
  email: String,
  created: Date,
  type: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
