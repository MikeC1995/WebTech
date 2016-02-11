'use strict';

var trips = angular.module('trips');
trips.controller('tripsController', ['$scope', function($scope) {
  $scope.currentTrip = {};
}]);
