'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  // make the currently selected tab available to all factory users
  tripsFactory.setSelectedTripIndex(0);
  $scope.tripName = ""; // the name of the new trip to add

  // function bindings
  $scope.trips = tripsFactory.getTrips;    // getter

  // function bindings
  $scope.submit = function() {
    tripsFactory.addTrip($scope.tripName);
    $scope.tripName = '';
  }

  // Select a tab by index
  $scope.select = function(index) {
    tripsFactory.setSelectedTripIndex(index);
  }

  // Checks if a tab is selected by index
  $scope.isSelected = function(index) {
    return index == tripsFactory.getSelectedTripIndex();
  }
}]);
