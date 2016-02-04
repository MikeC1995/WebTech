'use strict';
var should = require('should');

should.Assertion.add(
  'BadRequest',
  function() {
      this.params = { operator: 'to be a BadRequest error' };

      var BadRequest = this.obj;

      should.exist(BadRequest);
      BadRequest.should.be.an.Object;
      BadRequest.status.should.equal(400);
      BadRequest.body.should.be.json;
      should.exist(BadRequest.body.message);
  }
);
should.Assertion.add(
  'NotFound',
  function() {
      this.params = { operator: 'to be a NotFound error' };

      var NotFound = this.obj;

      should.exist(NotFound);
      NotFound.should.be.an.Object;
      NotFound.status.should.equal(404);
      NotFound.body.should.be.json;
      should.exist(NotFound.body.message);
  }
);
should.Assertion.add(
  'InternalServerError',
  function() {
      this.params = { operator: 'to be an InternalServerError error' };

      var InternalServerError = this.obj;

      should.exist(InternalServerError);
      InternalServerError.should.be.an.Object;
      InternalServerError.status.should.equal(500);
      InternalServerError.body.should.be.json;
      should.exist(InternalServerError.body.message);
  }
);
