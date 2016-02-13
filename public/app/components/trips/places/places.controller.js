'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selectedIndex = 0; // the currently selected place

  // function bindings
  $scope.trips = tripsFactory.getTrips;    // getter
  $scope.places = tripsFactory.getPlaces;

  $scope.getSelectedTrip = function() {
    return $scope.trips()[tripsFactory.getSelectedTripIndex()];
  }

  // check if a place is selected by index
  $scope.isSelected = function(index) {
    return index == $scope.selectedIndex;
  }
}]);
