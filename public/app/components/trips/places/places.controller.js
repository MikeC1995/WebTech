'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selectedIndex = 0; // the currently selected place
  $scope.placeName = '';  // the name of the new place to add

  // function bindings
  $scope.places = tripsFactory.getPlaces;

  // add place form submit
  $scope.submit = function() {
    tripsFactory.addPlace($scope.placeName, $scope.currentTrip()._id);
    $scope.placeName = '';
  }

  // check if a place is selected by index
  $scope.isSelected = function(index) {
    return index == $scope.selectedIndex;
  }
}]);
