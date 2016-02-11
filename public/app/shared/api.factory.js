'use strict';

var api = angular.module('api');
api.factory('apiFactory', ['$http', function apiFactory($http) {
  var urlBase = '/api/trips';
  var apiFactory = {};

  apiFactory.getTrips = function () {
    return $http.get(urlBase);
  };

  apiFactory.addTrip = function(trip) {
    return $http.post(urlBase, trip);
  };

  apiFactory.getPlaces = function() {
    return $http.get(urlBase + '/places');
  }

  apiFactory.addPlace = function(place) {
    return $http.post(urlBase + '/places', place);
  }

  return apiFactory;
}]);
