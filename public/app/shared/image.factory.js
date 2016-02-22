'use strict';

var api = angular.module('api');
api.factory('imageFactory', ['$rootScope', 'apiFactory', function tripsFactory($rootScope, apiFactory) {
  var imageFactory = {};

  var photos = [];

  // If callback is specified, fetches urls from server
  // Otherwise, returns local urls object
  imageFactory.getPhotos = function(params, callback) {
    if(callback !== undefined) {
      apiFactory.getPhotos(params)
        .then(function(response) {
          photos = response.data.data;
          callback(photos);
        }, function(error) {
          // TODO: handle connection error
          console.log("error");
          photos = [];
        });
    } else {
      return photos;
    }
  }

  imageFactory.deletePhotos = function(photos, callback) {
    if(photos.length) {
      console.log(photos);
      apiFactory.deletePhotos(photos)
        .then(function(response) {
          callback();
        }, function(error) {
          // TODO: handle connection error
          console.log("error");
        });
    }
  }

  return imageFactory;
}]);
