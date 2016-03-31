'use strict';

var trips = angular.module('trips');
trips.controller('galleryController', ['$scope', 'imageFactory', '$state', function($scope, imageFactory, $state) {
  // The list of cached photos (properties: url and key) for this place gallery
  $scope.photos = [];
  // The list of currently selected photos
  $scope.selectedPhotos = [];

  // Select/deselect a photo depending on whether it is already selected
  $scope.toggleSelectPhoto = function(photo) {
    for(var i = 0; i < $scope.selectedPhotos.length; i++) {
      if($scope.selectedPhotos[i]._id == photo._id) {
        $scope.selectedPhotos.splice(i, 1);
        return;
      }
    }
    $scope.selectedPhotos.push(photo);
  }
  // checks if a given photo is in the selected list
  $scope.isSelectedPhoto = function(photo) {
    for(var i = 0; i < $scope.selectedPhotos.length; i++) {
      if($scope.selectedPhotos[i]._id == photo._id) {
        return true;
      }
    }
    return false;
  }

  // Load first set of images for a place. More will be loaded on scroll.
  function loadInitial() {
    // TODO: limit 80 to guarantee div filled. However, need to
    // limit by the size of the gallery and # thumbs that will fit!
    var params = {
      place_id: $scope.placeId(),
      timebefore: Date.now(),
      limit: 120
    };
    imageFactory.getPhotos(params, function(photos) {
      $scope.photos = photos;
    });
  }
  loadInitial();

  // load more images (as the user scrolls)
  $scope.loadMore = function() {
    var place_id = $scope.placeId();
    var oldest = $scope.photos[$scope.photos.length - 1];
    var params = {
      place_id: place_id,
      timebefore: oldest.timestamp
    };
    imageFactory.getPhotos(params, function(photos) {
      for(var i = 0; i < photos.length; i++) {
        $scope.photos.push(photos[i]);
      }
    });
  }

  // Delete the currently selected photos
  $scope.deletePhotos = function() {
    imageFactory.deletePhotos($scope.selectedPhotos, function() {
      // reset gallery by reloading photos object
      loadInitial();
      $scope.selectedPhotos = [];
    });
  }

  // Event emitted by add-photos modal, indicating that new photos were uploaded
  // Therefore the gallery needs updating
  $scope.$on('uploaded-photos', function(event, args) {
    //If the place to which photos were added is not this one, ignore
    console.log($scope.placeId());
    if(args.place._id != $scope.placeId()) {
      return;
    }
    var params = {
      place_id: args.place._id,
      limit: args.number  // fetch the correct number of new images
    };
    // fetch photos newer than the current newest
    var newest = $scope.photos[0];
    if(newest !== undefined) {
      params.timeafter = newest.timestamp;
    }
    imageFactory.getPhotos(params, function(photos) {
      for(var i = 0; i < photos.length; i++) {
        $scope.photos.unshift(photos[i]);
      }
    });
  });

}]);
