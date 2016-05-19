'use strict';

var modals = angular.module('modals');
modals.controller('addPlaceController', ['$scope', 'tripDataFactory', '$state', '$stateParams', '$window', function($scope, tripDataFactory, $state, $stateParams, $window) {
  $scope._id = undefined;
  $scope.name = '';
  $scope.location = {};
  $scope.from_date = '';
  $scope.to_date = '';
  // if we are editing an existing place:
  if($stateParams.place) {
    $scope._id = $stateParams.place._id;
    $scope.name = $stateParams.place.location.name;
    $scope.location = $stateParams.place.location;
    $scope.from_date = new Date($stateParams.place.from_date);
    $scope.to_date = new Date($stateParams.place.to_date);
  }

  $scope.submit = function() {
    var place = {
      trip_id: $scope.$parent.selected.getTrip()._id,  // attached as attribute to modal directive
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

    // If the place _id is already defined, we are editing an existing place
    if($scope._id) {
      place._id = $scope._id;
      tripDataFactory.updatePlace(place).then(function(places) {
        console.log("Successfully updated place!");
        $state.go('trips');
      }, function() {
        console.error("Update place promise rejected!");
      });
    } else {
      // add a new place
      tripDataFactory.addPlace(place).then(function(places) {
        console.log("Successfully added place!");
        $state.go('trips');
      }, function() {
        console.error("Add place promise rejected!");
      });
    }
  }

  $scope.validate = function(place) {
    if(place.from_date > place.to_date) {
      return false;
    }
    return true;
  }
}]);
