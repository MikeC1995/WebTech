'use strict';

var trips = angular.module('trips');
trips.controller('tripsController', ['$scope', 'tripsFactory2', function($scope, tripsFactory2) {
  // The currently selected trip
  $scope.selectedTrip = {};

  // Local copies
  $scope.trips = [];
  $scope.places = [];
  // Getters
  $scope.getTrips = function() { return $scope.trips; }
  $scope.getPlaces = function() { return $scope.places; }

  // Initialise
  function updateTrips() {
    tripsFactory2.getTrips.then(function(trips) {
      $scope.trips = trips;
      $scope.selectedTrip = trips[0];
    }, function(err) {
      console.error("Error on trips promise");
    });
  }

  function updatePlaces() {
    tripsFactory2.getPlaces.then(function(places) {
      $scope.places = places;
      console.log(places);
    }, function(err) {
      console.error("Error on places promise");
    });
  }
  updateTrips();
  updatePlaces();


}]);
