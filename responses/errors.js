'use strict';

module.exports.BadRequest = function(res, missing) {
  res.statusCode = 400;
  var error = {};
  if(missing) {
    error.message = 'The request is missing parameters: ' + JSON.stringify(missing);
  } else {
    error.message = 'The server could not process the request.';
  }
  res.send(error);
}

module.exports.NotFound = function(res, message) {
  res.statusCode = 404;
  var error = {};
  error.message = message || 'The requested resource couldn\'t be found';
  res.send(error);
}

module.exports.InternalServerError = function(res, message) {
  res.statusCode = 500;
  var error = {};
  error.message = message || 'Something went wrong. We\'re looking into it.';
  res.send(error);
}
