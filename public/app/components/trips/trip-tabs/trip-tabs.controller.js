'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.trips;

  getTrips();

  function getTrips() {
    tripsFactory.getTrips()
        .success(function (data) {
            $scope.trips = data.data;
        })
        .error(function (error) {
          // TODO: handle connection error
          $scope.trips = [];
        });
  }
}]);
