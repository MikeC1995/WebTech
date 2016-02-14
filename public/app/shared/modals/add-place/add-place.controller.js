'use strict';

var modals = angular.module('modals');
modals.controller('addPlaceController', ['$scope', 'tripsFactory', '$state', function($scope, tripsFactory, $state) {
  $scope.name = '';
  $scope.location = {};
  $scope.from_date = '';
  $scope.to_date = '';

  $scope.submit = function() {
    var place = {
      trip_id: tripsFactory.getTrips()[tripsFactory.getSelectedTripIndex()]._id,
      location: {
        name: $scope.name,
        lat: $scope.location.lat,
        lng: $scope.location.lng
      },
      from_date: $scope.from_date,
      to_date: $scope.to_date
    }

    if(!$scope.validate(place)) {
      // TODO: display pretty error
      alert("From date cannot be after To date!");
      return;
    }

    tripsFactory.addPlace(place);
    $state.go('trips');
  }

  $scope.validate = function(place) {
    if(place.from_date > place.to_date) {
      return false;
    }
    return true;
  }
}]);
