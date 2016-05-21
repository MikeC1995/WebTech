'use strict';

var trips = angular.module('trips');
trips.controller('tripsController', ['$rootScope', '$scope', 'tripDataFactory', '$state', 'authFactory', function($rootScope, $scope, tripDataFactory, $state, authFactory) {

  // Load trips for the authenticated user only
  authFactory.user().then(function(user) {
    $state.params.user_id = user._id;
  }, function() {
    // TODO: handle no user id error
    console.log("No user id!");
  });

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
