'use strict';

// The root application module for this app
var app = angular.module('app', ['ui.router', 'trips']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("map", {
      url:"/",
      views: {
        '': { templateUrl:"/app/components/map/map.view.html" }
      }
    })
    .state("trips", {
      url:"/trips",
      views: {
        '': { templateUrl:"/app/components/trips/trips.view.html" }
      }
    })
    .state("friends", {
      url:"/friends",
      views: {
        '': { templateUrl:"/app/components/friends/friends.view.html" }
      }
    });
  $urlRouterProvider.otherwise("/");
});

app.controller('appController', function() {

});
