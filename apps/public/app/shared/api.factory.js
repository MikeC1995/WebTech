'use strict';

var api = angular.module('api');
api.factory('apiFactory', ['$http', function apiFactory($http) {
  var urlBase = '/api';
  var apiFactory = {};

  apiFactory.logout = function() {
    return $http.get(urlBase + '/logout');
  }

  apiFactory.getUser = function(user_id) {
    if(user_id) {
      return $http.get(urlBase + '/users/' + user_id);
    }
    return $http.get(urlBase + '/users/me');
  }

  apiFactory.getTrips = function () {
    return $http.get(urlBase + '/trips');
  };

  apiFactory.addTrip = function(trip) {
    return $http.post(urlBase + '/trips', trip);
  };

  apiFactory.deleteTrip = function(trip) {
    return $http.delete(urlBase + '/trips/' + trip._id);
  };

  apiFactory.updateTrip = function(trip) {
    return $http.put(urlBase + '/trips/' + trip._id, trip);
  };

  apiFactory.getPlaces = function() {
    return $http.get(urlBase + '/places');
  }

  apiFactory.addPlace = function(place) {
    return $http.post(urlBase + '/places', place);
  }

  apiFactory.updatePlace = function(place) {
    return $http.put(urlBase + '/places/' + place._id, place);
  }

  apiFactory.deletePlace = function(place) {
    return $http.delete(urlBase + '/places/' + place._id);
  }

  apiFactory.getPhotos = function(params) {
    var qstring = '/photos?place_id=' + params.place_id;
    if(params.timebefore) qstring += ('&timebefore=' + params.timebefore);
    if(params.timeafter) qstring += ('&timeafter=' + params.timeafter);
    if(params.limit) qstring += ('&limit=' + params.limit);
    return $http.get(urlBase + qstring);
  }

  apiFactory.deletePhoto = function(photo_id) {
    return $http.delete(urlBase + '/photos/' + photo_id);
  }

  return apiFactory;
}]);
