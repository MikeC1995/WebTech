'use strict';

var trips = angular.module('trips');
trips.controller('placesController', ['$rootScope', '$scope', 'tripDataFactory', function($rootScope, $scope, tripDataFactory) {

  $scope.places = []; // full places list
  $scope.filteredPlaces = []; // places filtered according to current trip

  // Fetching and updating places
  function updatePlaces() {
    tripDataFactory.getPlaces().then(function(places) {
      $scope.places = places;
      $scope.$apply();
    }, function(err) {
      console.error("Error on places promise");
    });
  }
  updatePlaces();
  $rootScope.$on('places.updated', updatePlaces);

  // Update selected place when radio selection changed
  $scope.selectedIndex = -1;
  $scope.$watch('selectedIndex', function(n, o) {
    if($scope.filteredPlaces.length != 0) {
      $scope.selected.setPlace($scope.filteredPlaces[n]);
    }
  });

  // Select first place when the places are changed
  // (Caused by e.g. change of trip, or add/remove place)
  $scope.$watch(function() {
    if($scope.filteredPlaces.length == 0) {
      return -1;
    } else {
      return $scope.filteredPlaces[0]._id;
    }
  }, function(n, o) {
    if($scope.filteredPlaces.length > 0) {
      $scope.selected.setPlace($scope.filteredPlaces[0]);
    }
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
