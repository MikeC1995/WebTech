'use strict';

var trips = angular.module('trips');
trips.controller('tripTabsController', ['$rootScope', '$scope', 'tripDataFactory', function($rootScope, $scope, tripDataFactory) {
  $scope.newTripName = ""; // the name of the new trip to add

  $scope.trips = [];

  $scope.tripToRename = {};

  // Fetching and updating trips
  function updateTrips() {
    tripDataFactory.getTrips().then(function(trips) {
      $scope.trips = trips;
      $scope.$apply();
    }, function(err) {
      console.error("Error on trips promise");
    });
  }
  updateTrips();
  $rootScope.$on('trips.updated', updateTrips);

  // Checks if a trip tab is selected
  $scope.isSelected = function(trip) {
    return trip._id == $scope.selected.getTrip()._id;
  }

  // Select a trip tab
  $scope.select = function(trip) {
    $scope.selected.setTrip(trip);
  }

  $scope.deleteTrip = function(trip) {
    tripDataFactory.deleteTrip(trip)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        console.log("Deleted!");
      }, function() {
        console.error("Unable to delete !");
      });
  }

  $scope.addNewTrip = function() {
    tripDataFactory.addTrip($scope.newTripName)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        console.log("added!");
      }, function() {
        console.error("Unable to add trip!");
      });
    $scope.newTripName = '';
  }

  $scope.stopRenaming = function () {
    $scope.tripToRename = {};
  }
  $scope.editName = function(trip) {
    $scope.tripToRename = trip;
  }

  $scope.renameOpen = function(trip) {
    if($scope.tripToRename._id == trip._id) {
      return true;
    }
    return false;
  }

  $scope.updateTrip = function(trip) {
    tripDataFactory.updateTrip(trip)
      .then(function(trips) {
        $scope.trips = trips;
        $scope.$apply();
        $scope.stopRenaming();
        console.log("Renamed!");
      }, function() {
        console.error("Unable to rename!");
      });
  }

}]);
