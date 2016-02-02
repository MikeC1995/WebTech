'use strict';

// The root application module for this app
var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("map", {
      url:"/",
      templateUrl:"/app/components/map/map.view.html"
    })
    .state("trips", {
      url:"/trips",
      templateUrl:"/app/components/trips/trips.view.html"
    })
    .state("friends", {
      url:"/friends",
      templateUrl:"/app/components/friends/friends.view.html"
    });
  $urlRouterProvider.otherwise("/");
});

app.controller('appController', function() {

});
