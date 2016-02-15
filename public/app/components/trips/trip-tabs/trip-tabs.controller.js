'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.tripName = ""; // the name of the new trip to add

  // function bindings
  $scope.trips = tripsFactory.getTrips;    // getter

  // Set initially selected trip
  tripsFactory.getTrips(function(trips) {
    tripsFactory.setSelectedTrip(trips[0]);
  });

  // function bindings
  $scope.submit = function() {
    tripsFactory.addTrip($scope.tripName);
    $scope.tripName = '';
  }

  // Select a trip tab
  $scope.select = function(trip) {
    tripsFactory.setSelectedTrip(trip);
  }

  // Checks if a trip tab is selected
  $scope.isSelected = function(trip) {
    return trip._id == tripsFactory.getSelectedTrip()._id;
  }
}]);
