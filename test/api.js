'use strict';
var supertest = require('supertest');
var errAssertions = require('./assertions/errors.js');
var sucAssertions = require('./assertions/successes.js');
var should = require('should');

var port = 8080;
var server = supertest.agent('http://localhost:' + port);

describe('Routing', function() {
  // TEST /api/trips
  describe('Trips', function() {
    var url = '/api/trips';
    it('GET ' + url, function(done) {
      server.get(url)
            .end(function(err,res) {
              console.log(res.status);
              res.should.be.OK();
              done();
            });
    });
    it('POST ' + url + ' :: missing properties in body', function(done) {
      server.post(url)
            .send({})
            .end(function(err,res) {
              res.should.be.BadRequest();
              done();
            });
    });
    it('POST ' + url + ' :: correct properties in body', function(done) {
      server.post(url)
            .send({ name : 'test'})
            .end(function(err,res) {
              res.should.be.Created();
              done();
            });
    });
  });
  // TEST /api/trips/places
  describe('Places', function() {
    var url = '/api/trips/places';
    it('GET ' + url + ' :: empty parameters in URL', function(done) {
      server.get(url)
            .end(function(err,res) {
              console.log(res.status);
              res.should.be.OK();
              done();
            });
    });
    it('GET ' + url + ' :: trip_id parameter in URL', function(done) {
      server.get(url + '?trip_id=test_id')
            .end(function(err,res) {
              console.log(res.status);
              res.should.be.OK();
              done();
            });
    });
    it('POST ' + url + ' :: missing properties in body', function(done) {
      server.post(url)
            .send({})
            .end(function(err,res) {
              res.should.be.BadRequest();
              done();
            });
    });
    it('POST ' + url + ' :: correct properties in body', function(done) {
      server.post(url)
            .send({ name : 'test'})
            .send({ trip_id: 'test_id'})
            .end(function(err,res) {
              res.should.be.Created();
              done();
            });
    });
  });
});
