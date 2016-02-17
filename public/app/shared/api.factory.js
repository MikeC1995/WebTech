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

  apiFactory.getPhotos = function(params) {
    var qstring = '/photos?place_id=' + params.place_id;
    if(params.timebefore) qstring += ('&timebefore=' + params.timebefore);
    if(params.timeafter) qstring += ('&timeafter=' + params.timeafter);
    console.log(qstring);
    return $http.get(urlBase + qstring);
  }

  return apiFactory;
}]);
