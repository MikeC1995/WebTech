'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selectedIndex = 0;
  $scope.placeName = '';

  // function bindings
  $scope.places = tripsFactory.places;

  $scope.submit = function() {
    tripsFactory.addPlace($scope.placeName, $scope.currentTrip()._id);
    $scope.placeName = '';
  }

  $scope.isSelected = function(index) {
    return index == $scope.selectedIndex;
  }
}]);
