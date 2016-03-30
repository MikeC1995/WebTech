'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', 'tripsFactory2', function($scope, tripsFactory, tripsFactory2) {
  $scope.selectedIndex = 0; // the currently selected radio button
  $scope.filteredPlaces = [];

  // check if a place is selected by index
  $scope.isSelected = function(place) {
    if($scope.selectedIndex > $scope.filteredPlaces.length - 1) {
      $scope.selectedIndex = 0;
    }
    return place._id == $scope.filteredPlaces[$scope.selectedIndex]._id;
  }

  $scope.print = function() {
    console.log($scope.places);
  }

  $scope.deletePlace = function(place) {
    tripsFactory2.deletePlace(place)
      .then(function(places) {
        $scope.places = places;
        $scope.$apply();
        console.log("Deleted!");
      }, function() {
        console.error("Unable to delete !");
      });
  }
}]);
