'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selectedIndex = 0; // the currently selected tab
  $scope.tripName = ""; // the name of the new trip to add
  $scope.placeName = ""; // the name of the new trip to add

  // function bindings
  $scope.trips = tripsFactory.getTrips;    // getter

  // Initialise + update currentTrip
  tripsFactory.getTrips(function(response) {
    $scope.currentTrip = response[$scope.selectedIndex];
  });
  $scope.$watch('selectedIndex', function (value) {
    $scope.currentTrip = $scope.trips()[value];
  });

  // function bindings
  $scope.submit = function() {
    tripsFactory.addTrip($scope.tripName);
    $scope.tripName = '';
  }

  // Select a tab by index
  $scope.select = function(index) {
    $scope.selectedIndex = index;
  }

  // Checks if a tab is selected by index
  $scope.isSelected = function(index) {
    return index == $scope.selectedIndex;
  }
}]);
