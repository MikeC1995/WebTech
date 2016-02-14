'use strict';

var modals = angular.module('modals');
modals.controller('addPlaceController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  $scope.name = '';
  $scope.location = {};

  $scope.submit = function() {
    var place = {
      name: $scope.name,
      trip_id: tripsFactory.getTrips()[tripsFactory.getSelectedTripIndex()]._id
    }

    tripsFactory.addPlace(place);
  }
}]);
