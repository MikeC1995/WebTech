'use strict';

var trips = angular.module('trips');
trips.controller('tripsController', ['$rootScope', '$scope', 'tripDataFactory', '$state', 'userFactory', function($rootScope, $scope, tripDataFactory, $state, userFactory) {

  $scope.selected = new tripDataFactory.Selected();

  // Local copies
  $scope.trips = [];
  $scope.places = [];
  // Getters
  $scope.getTrips = function() { return $scope.trips; }
  $scope.getPlaces = function() { return $scope.places; }

  // Initialise
  function updateTrips() {
    tripDataFactory.getTrips().then(function(trips) {
      $scope.trips = trips;
      $scope.selected.setTrip(trips[0]);
      $scope.$apply();
    }, function(err) {
      console.error("Error on trips promise");
    });
  }

  function updatePlaces() {
    tripDataFactory.getPlaces().then(function(places) {
      $scope.places = places;
      $scope.$apply();
    }, function(err) {
      console.error("Error on places promise");
    });
  }

  updateTrips();
  updatePlaces();
  $rootScope.$on("trips.updated", updateTrips);
  $rootScope.$on("places.updated", updatePlaces);
}]);
