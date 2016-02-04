'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.trips; // a list of trip objects fetched from the server
  $scope.selectedIndex = 0; // the currently selected tab
  $scope.tripName = ""; // the name of the new trip to add

  getTrips();

  function getTrips() {
    tripsFactory.getTrips()
        .success(function(data) {
            $scope.trips = data.data;
        })
        .error(function(error) {
          // TODO: handle connection error
          $scope.trips = [];
        });
  };

  $scope.addTrip = function() {
    if ($scope.tripName) {
      var trip = {
        name: $scope.tripName.toUpperCase()
      };
      tripsFactory.addTrip(trip)
        .success(function(data) {
          getTrips();
        })
        .error(function(error) {
          //TODO handle error
          alert('Unable to add trip! :(');
        });
      console.log("ADD TRIP " + $scope.tripName.toUpperCase());
    }
  };

  $scope.select = function(index) {
    $scope.selectedIndex = index;
  }
  $scope.isSelected = function(index) {
    return index == $scope.selectedIndex;
  }
}]);
