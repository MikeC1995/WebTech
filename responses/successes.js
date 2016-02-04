'use strict';

module.exports = {
  OK: function(res, data) {
    res.statusCode = 200;
    this.message = 'Success';
    if(data) {
      this.data = data;
    }
    res.send(this);
  },
  Created: function(res, what) {
    res.statusCode = 201;
    if(what) {
      this.message = 'Successfully created ' + JSON.stringify(what);
    } else {
      this.message = 'The request has been fulfilled and resulted in a new resource being created.';
    }
    res.send(this);
  }
};
