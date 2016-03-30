'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$rootScope', '$scope', 'tripDataFactory', function($rootScope, $scope, tripDataFactory) {

  $scope.places = []; // full places list
  $scope.filteredPlaces = []; // places filtered according to current trip

  // Initial fetch of places
  $rootScope.$on('places.updated', function() {
    tripDataFactory.getPlaces().then(function(places) {
      $scope.places = places;
      $scope.$apply();
    }, function() {
      console.error("Unable to get places");
    });
  });

  // Update selected place when radio selection changed
  $scope.selectedIndex = -1;
  $scope.$watch('selectedIndex', function(n, o) {
    if($scope.filteredPlaces.length != 0) {
      $scope.selected.setPlace($scope.filteredPlaces[n]);
    }
  });

  // Select first place when the trip is changed
  $scope.$watch(function() {
    return $scope.selected.getTrip()._id;
  }, function(n, o) {
    $scope.selectedIndex = 0;
  });

  // check if a place is selected by index
  $scope.isSelected = function(place) {
    return place._id == $scope.selected.getPlace()._id
  }

  $scope.deletePlace = function(place) {
    tripDataFactory.deletePlace(place)
      .then(function(places) {
        $scope.places = places;
        $scope.selectedIndex = 0;
        if($scope.filteredPlaces.length != 0) {
          $scope.selected.setPlace($scope.filteredPlaces[$scope.selectedIndex]);
        }
        $scope.$apply();
        console.log("Deleted!");
      }, function() {
        console.error("Unable to delete !");
      });
  }
}]);
