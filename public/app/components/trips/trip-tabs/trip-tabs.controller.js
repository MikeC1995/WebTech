'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory2', function($scope, tripsFactory2) {
  $scope.tripName = ""; // the name of the new trip to add

  // Checks if a trip tab is selected
  $scope.isSelected = function(trip) {
    return trip._id == $scope.selectedTrip._id;
  }

  // Select a trip tab
  $scope.select = function(trip) {
    $scope.selectedTrip = trip;
  }

  $scope.deleteTrip = function(trip) {
    tripsFactory2.deleteTrip(trip)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        console.log("Deleted!");
      }, function() {
        console.error("Unable to delete !");
      });
  }

  $scope.submit = function() {
    tripsFactory2.addTrip($scope.tripName)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        console.log("added!");
      }, function() {
        console.error("Unable to add trip!");
      });
    $scope.tripName = '';
  }

}]);
