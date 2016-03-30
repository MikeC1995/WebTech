'use strict';

var modals = angular.module('modals');
modals.controller('addPlaceController', ['$scope', 'tripsFactory2', '$state', function($scope, tripsFactory2, $state) {
  $scope.name = '';
  $scope.location = {};
  $scope.from_date = '';
  $scope.to_date = '';

  $scope.submit = function() {
    var place = {
      trip_id: $scope.data().trip()._id,  // attached as attribute to modal directive
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

    tripsFactory2.addPlace(place).then(function(places) {
      console.log("Successfully added place!");
      $state.go('trips');
    }, function() {
      console.error("Add place promise rejected!");
    });
  }

  $scope.validate = function(place) {
    if(place.from_date > place.to_date) {
      return false;
    }
    return true;
  }
}]);
