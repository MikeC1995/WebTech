'use strict';

// The map module
var trips = angular.module('trips');
trips.factory('tripsFactory', ['$http', function tripsFactory($http) {
  var urlBase = '/api/trips';
  var tripsFactory = {};

  tripsFactory.getTrips = function () {
    return $http.get(urlBase);
  };

  tripsFactory.addTrip = function(trip) {
    return $http.post(urlBase, trip);
  };

  return tripsFactory;
}]);
