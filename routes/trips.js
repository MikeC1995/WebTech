var err = require('../errors.js');
module.exports = {
  get:  function(req, res) {
    res.send("TRIPS GET!!");
  },
  post: function(req, res) {
    var name = req.body.name;
    if(name === undefined) {
      return res.send(new err.badRequest('name'));
    }
    res.send("you asked for " + name);
  }
}
