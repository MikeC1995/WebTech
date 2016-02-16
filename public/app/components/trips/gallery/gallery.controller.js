'use strict';

var trips = angular.module('trips');
trips.controller('galleryController', ['$scope', 'tripsFactory', 'imageFactory', function($scope, tripsFactory, imageFactory) {
  $scope.imageUrls = [];

  $scope.getSelectedPlace = tripsFactory.getSelectedPlace;

  $scope.$watch(function() {
    return $scope.getSelectedPlace()._id;
  }, function(place_id) {
    if(place_id !== undefined) {
      imageFactory.getImageUrls(place_id, function(urls) {
        $scope.imageUrls = urls;
      });
    }
  });

}]);
