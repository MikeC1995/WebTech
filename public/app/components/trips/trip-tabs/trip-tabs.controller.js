'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$rootScope', '$scope', 'tripDataFactory', function($rootScope, $scope, tripDataFactory) {
  $scope.tripName = ""; // the name of the new trip to add

  $scope.trips = [];
  $rootScope.$on('trips.updated', function() {
    tripDataFactory.getTrips().then(function(trips) {
      $scope.trips = trips;
      $scope.$apply();
    }, function() {
      console.error("Couldnt get trips");
    });
  });

  // Checks if a trip tab is selected
  $scope.isSelected = function(trip) {
    return trip._id == $scope.selected.getTrip()._id;
  }

  // Select a trip tab
  $scope.select = function(trip) {
    $scope.selected.setTrip(trip);
  }

  $scope.deleteTrip = function(trip) {
    tripDataFactory.deleteTrip(trip)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        console.log("Deleted!");
      }, function() {
        console.error("Unable to delete !");
      });
  }

  $scope.submit = function() {
    tripDataFactory.addTrip($scope.tripName)
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
