'use strict';
var should = require('should');

should.Assertion.add(
  'OK',
  function() {
      this.params = { operator: 'to be an OK success' };

      var OK = this.obj;

      should.exist(OK);
      OK.should.be.an.Object;
      OK.status.should.equal(200);
      OK.body.should.be.json;
      should.exist(OK.body.message);
      should.exist(OK.body.data);
      OK.body.data.should.be.instanceOf(Array);
  }
);
should.Assertion.add(
  'Created',
  function() {
      this.params = { operator: 'to be a Created success' };

      var Created = this.obj;

      should.exist(Created);
      Created.should.be.an.Object;
      Created.status.should.equal(201);
      Created.body.should.be.json;
      should.exist(Created.body.message);
  }
);
