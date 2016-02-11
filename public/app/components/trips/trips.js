'use strict';

// The trips module
var trips = angular.module('trips', ['ui.router', 'api']);

trips.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/trips");
});
