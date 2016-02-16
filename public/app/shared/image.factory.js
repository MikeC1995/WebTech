'use strict';

var api = angular.module('api');
api.factory('imageFactory', ['$rootScope', 'apiFactory', function tripsFactory($rootScope, apiFactory) {
  var imageFactory = {};

  //TODO: cache urls? Currently fetches them every time place changed

  var imageUrls = [];

  // If callback is specified, fetches urls from server
  // Otherwise, returns local urls object
  imageFactory.getImageUrls = function(place_id, callback) {
    if(callback !== undefined) {
      apiFactory.getPhotos(place_id)
        .then(function(response) {
          imageUrls = response.data.data;
          callback(imageUrls);
        }, function(error) {
          // TODO: handle connection error
          console.log("error");
          imageUrls = [];
        });
    } else {
      return imageUrls;
    }
  }

  return imageFactory;
}]);
