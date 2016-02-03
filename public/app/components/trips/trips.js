'use strict';

// The trips module
var trips = angular.module('trips', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/trips");
});
