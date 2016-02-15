'use strict';

module.exports.OK = function(res, data) {
  res.statusCode = 200;
  var success = {};
  success.message = 'Success';
  if(data) {
    success.data = data;
  }
  res.send(success);
}
module.exports.Created = function(res, what) {
  res.statusCode = 201;
  var success = {};
  if(what) {
    success.message = 'Successfully created ' + JSON.stringify(what);
  } else {
    success.message = 'The request has been fulfilled and resulted in a new resource being created.';
  }
  console.log(JSON.stringify(success));
  res.send(success);
}
