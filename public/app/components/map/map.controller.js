'use strict';

var map = angular.module('map');
map.controller('mapController', ['$scope', 'tripsFactory', function($scope, tripsFactory) {
  // function bindings
  $scope.trips = tripsFactory.getTrips;
  $scope.places = tripsFactory.getPlaces;
  $scope.getSelectedTrip = tripsFactory.getSelectedTrip;


  // return the currently selected place
  $scope.selectedPlace = function() {
    return tripsFactory.getSelectedPlace();
  }

  // format and ISO date into dd/mm/yyyy
  $scope.formatDate = function(iso_date) {
    var date = new Date(iso_date);
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
  }

}]);
