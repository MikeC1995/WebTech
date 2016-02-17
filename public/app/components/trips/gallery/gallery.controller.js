'use strict';

var trips = angular.module('trips');
trips.controller('galleryController', ['$scope', 'tripsFactory', 'imageFactory', function($scope, tripsFactory, imageFactory) {
  $scope.photos = [];

  $scope.getSelectedPlace = tripsFactory.getSelectedPlace;

  var params = {
    place_id: $scope.getSelectedPlace()._id,
    timebefore: Date.now()
  };
  imageFactory.getPhotos(params, function(photos) {
    $scope.photos = photos;
  });

  $scope.loadMore = function() {
    var oldest = $scope.photos[$scope.photos.length - 1];
    var params = {
      place_id: $scope.getSelectedPlace()._id,
      timebefore: oldest.timestamp
    };
    imageFactory.getPhotos(params, function(photos) {
      console.log(photos);
      for(var i = 0; i < photos.length; i++) {
        $scope.photos.push(photos[i]);
      }
    });
  }

}]);
