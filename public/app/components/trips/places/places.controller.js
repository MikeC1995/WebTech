'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selectedIndex = 0; // the currently selected radio button
  $scope.filteredPlaces = [];

  // function bindings
  $scope.trips = tripsFactory.getTrips;
  $scope.places = tripsFactory.getPlaces;
  $scope.getSelectedTrip = tripsFactory.getSelectedTrip;

  // update selected trip when selected radio button changes
  $scope.$watch(function() {
    return $scope.filteredPlaces[$scope.selectedIndex];
  }, function(value) {
    if(value !== undefined) {
      tripsFactory.setSelectedPlace(value);
    } else {
      $scope.selectedIndex = 0;
      if($scope.filteredPlaces.length != 0) {
        tripsFactory.setSelectedPlace($scope.filteredPlaces[$scope.selectedIndex]);
      }
    }
  });

  // check if a place is selected by index
  $scope.isSelected = function(place) {
    return place._id == tripsFactory.getSelectedPlace()._id;
  }

  $scope.deletePlace = function(place) {
    tripsFactory.deletePlace(place);
  }
}]);
