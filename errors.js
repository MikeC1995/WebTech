module.exports = {
  notFound: function(message, errorCode) {
    this.message = message || 'The requested resource couldn\'t be found';
    this.statusCode = 404;
    this.errorCode = errorCode || 404;
  },
  badRequest: function(missing, errorCode) {
    if(missing) {
      this.message = 'The request is missing parameters: ' + JSON.stringify(missing);
    } else {
      this.message = 'The request was malformed.';
    }
    this.statusCode = 400;
    this.errorCode = errorCode || 400;
  }
};
