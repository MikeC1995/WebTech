'use strict';

var trips = angular.module('trips');
trips.controller('galleryController', ['$scope', 'tripsFactory', 'imageFactory', function($scope, tripsFactory, imageFactory) {
  // Remember urls as we load them in this object, avoiding repeat server requests
  $scope.photos = {};
  // The current photos (a property of $scope.photos) used by ng-repeat
  $scope.currentPhotos = [];
  // The id of the currently selected place, (referring to a property in $scope.photos)
  $scope.selectedPlaceId = tripsFactory.getSelectedPlace()._id;
  $scope.getSelectedPlaceId = function() {
    return $scope.selectedPlaceId;
  }

  // watch for a change in the currently selected place
  $scope.$watch(function() {
    return tripsFactory.getSelectedPlace()._id;
  }, function(new_id) {
    $scope.selectedPlaceId = new_id;
    if($scope.photos[new_id] === undefined) {
      loadInitial();
    } else {
      $scope.currentPhotos = $scope.photos[new_id];
    }
  });

  // Load first set of images for a place
  function loadInitial() {
    // TODO: limit 80 to guarantee div filled. However, need to
    // limit by the size of the gallery and # thumbs that will fit!
    var params = {
      place_id: $scope.selectedPlaceId,
      timebefore: Date.now(),
      limit: 80
    };
    imageFactory.getPhotos(params, function(photos) {
      $scope.photos[params.place_id] = photos;
      $scope.currentPhotos = $scope.photos[params.place_id];
    });
  }
  loadInitial();

  // load more images (as the user scrolls)
  $scope.loadMore = function() {
    var place_id = $scope.selectedPlaceId;
    var oldest = $scope.photos[place_id][$scope.photos[place_id].length - 1];
    var params = {
      place_id: place_id,
      timebefore: oldest.timestamp
    };
    imageFactory.getPhotos(params, function(photos) {
      for(var i = 0; i < photos.length; i++) {
        $scope.photos[place_id].push(photos[i]);
      }
    });
  }

}]);
