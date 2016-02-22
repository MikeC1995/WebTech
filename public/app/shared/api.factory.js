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

  apiFactory.deletePlace = function(place) {
    return $http.delete(urlBase + '/trips/places?place_id=' + place._id);
  }

  apiFactory.getPhotos = function(params) {
    var qstring = '/photos?place_id=' + params.place_id;
    if(params.timebefore) qstring += ('&timebefore=' + params.timebefore);
    if(params.timeafter) qstring += ('&timeafter=' + params.timeafter);
    if(params.limit) qstring += ('&limit=' + params.limit);
    return $http.get(urlBase + qstring);
  }

  apiFactory.deletePhotos = function(photos) {
    return $http.post(urlBase + '/photos/delete', photos);
  }

  return apiFactory;
}]);
