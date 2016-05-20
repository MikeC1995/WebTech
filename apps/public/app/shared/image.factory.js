'use strict';

var api = angular.module('api');
api.factory('imageFactory', ['$rootScope', 'apiFactory', '$q', function imageFactory($rootScope, apiFactory, $q) {
  var imageFactory = {};

  var photos = [];

  // If callback is specified, fetches urls from server
  // Otherwise, returns local urls object
  imageFactory.getPhotos = function(params, callback) {
    if(callback !== undefined && params.place_id !== undefined) {
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
      var deletePromises = [];
      for(var i = 0; i < photos.length; i++) {
        deletePromises.push(apiFactory.deletePhoto(photos[i]._id));
      }

      $q.all(deletePromises).then(function() {
        callback();
      }, function(error) {
        // TODO: handle connection error
        console.log("error");
      });
    }
  }

  return imageFactory;
}]);
