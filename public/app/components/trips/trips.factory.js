'use strict';

// The map module
var trips = angular.module('trips');
trips.factory('tripsFactory', ['$http', function tripsFactory($http) {
  var urlBase = '/api/trips';
  var tripsFactory = {};

  tripsFactory.getTrips = function () {
    return $http.get(urlBase);
  };

  return tripsFactory;
}]);
