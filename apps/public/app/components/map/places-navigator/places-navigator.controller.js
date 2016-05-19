'use strict';

var map = angular.module('map');
map.controller('placesNavigatorController', ['$scope', function($scope) {
  $scope.$watch('selectedPlaceIndex', function(value) {
    $scope.transform = 'none';
    if($scope.filteredPlaces) {
      if($scope.filteredPlaces.length >= 3) {
        $scope.transform = 'translateX(' + (-100 * value + 100) + '%)';
      }
    }
  });
}]);
