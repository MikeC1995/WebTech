module.exports = {
  OK: function(data) {
    this.message = 'Success';
    this.statusCode = 200;
    if(data) {
      this.data = data;
    }
  },
  Created: function(what) {
    if(what) {
      this.message = 'Successfully created ' + JSON.stringify(what);
    } else {
      this.message = 'The request has been fulfilled and resulted in a new resource being created.';
    }
    this.statusCode = 201;
  }
};
