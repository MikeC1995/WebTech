module.exports = {
  BadRequest: function(missing, errorCode) {
    if(missing) {
      this.message = 'The request is missing parameters: ' + JSON.stringify(missing);
    } else {
      this.message = 'The server could not process the request.';
    }
    this.statusCode = 400;
    this.errorCode = errorCode || 400;
  },
  NotFound: function(message, errorCode) {
    this.message = message || 'The requested resource couldn\'t be found';
    this.statusCode = 404;
    this.errorCode = errorCode || 404;
  },
  InternalServerError: function() {
    this.message = message || 'Something went wrong. We\'re looking into it.';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
  }
};
