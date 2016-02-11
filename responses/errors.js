'use strict';

module.exports = {
  BadRequest: function(res, missing) {
    res.statusCode = 400;
    if(missing) {
      this.message = 'The request is missing parameters: ' + JSON.stringify(missing);
    } else {
      this.message = 'The server could not process the request.';
    }
    res.send(this);
  },
  NotFound: function(res, message) {
    res.statusCode = 404;
    this.message = message || 'The requested resource couldn\'t be found';
    res.send(this);
  },
  InternalServerError: function(res, message) {
    res.statusCode = 500;
    this.message = message || 'Something went wrong. We\'re looking into it.';
    res.send(this);
  }
};
