'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.selected = 0;
  $scope.placeName = '';

  // function bindings
  $scope.places = tripsFactory.places;

  $scope.submit = function() {
    //TODO places needs trip id
    tripsFactory.addPlace($scope.placeName, 'testid');
    $scope.placeName = '';
  }

  $scope.isSelected = function(index) {
    return index == $scope.selected;
  }
}]);
