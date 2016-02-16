'use strict';

var api = angular.module('api');
api.factory('apiFactory', ['$http', function apiFactory($http) {
  var urlBase = '/api';
  var apiFactory = {};

  apiFactory.getTrips = function () {
    return $http.get(urlBase + '/trips');
  };

  apiFactory.addTrip = function(trip) {
    return $http.post(urlBase + '/trips', trip);
  };

  apiFactory.getPlaces = function() {
    return $http.get(urlBase + '/trips/places');
  }

  apiFactory.addPlace = function(place) {
    return $http.post(urlBase + '/trips/places', place);
  }

  apiFactory.getPhotos = function(place_id) {
    return $http.get(urlBase + '/photos?place_id=' + place_id);
  }

  return apiFactory;
}]);
