'use strict';

var map = angular.module('map');
map.controller('placesNavigatorController', ['$scope', function($scope) {
  $scope.$watch('selectedPlaceIndex', function(value) {
    $scope.transform = 'translateX(' + (-100 * value + 100) + '%)';
  });
}]);
