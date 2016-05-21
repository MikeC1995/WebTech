var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  facebookID: String,
  accessToken: String,
  name: String,
  email: String,
  created: Date,
  type: String,
  public: Boolean
});

var User = mongoose.model('User', userSchema);

module.exports = User;
