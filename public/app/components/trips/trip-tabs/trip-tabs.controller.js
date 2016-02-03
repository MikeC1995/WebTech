'use strict';

// TODO: This is a temporary controller.
// User data should be stored somewhere and accessed via e.g. a service.
var trips = angular.module('trips');
trips.controller('tripTabsController', function($scope) {
  $scope.trips = ['Trip 1', 'Trip 2', 'Trip 3'];
});
