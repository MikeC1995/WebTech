'use strict';

var map = angular.module('map');
map.controller('placesNavigatorController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.updateTransform = function() {
    $scope.transform = 'none';
    if($scope.filteredPlaces) {
      if($scope.filteredPlaces.length >= 3) {
        $scope.transform = 'translateX(' + (-100 * $scope.selectedPlaceIndex + 100) + '%)';
      }
    }
  }
}]);
