'use strict';

var trips = angular.module('trips');
trips.controller('galleryController', ['$scope', 'tripsFactory', 'imageFactory', '$state', function($scope, tripsFactory, imageFactory, $state) {
  // Remember urls as we load them in this object, avoiding repeat server requests
  $scope.photos = {};
  // The current photos (a property of $scope.photos) used by ng-repeat
  $scope.currentPhotos = [];
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

  // Delete the currently selected photos
  $scope.deletePhotos = function() {
    imageFactory.deletePhotos($scope.selectedPhotos, function() {
      // Reload *this* ui-view to update gallery
      // (this resets the selected photos etc as the controller is reloaded)
      $state.go($state.current, {}, {reload: true});
    });
  }

  // The id of the currently selected place, (referring to a property in $scope.photos)
  $scope.selectedPlaceId = tripsFactory.getSelectedPlace()._id;

  // Event emitted by add-photos modal, indicating that new photos were uploaded
  // Therefore the gallery needs updating
  $scope.$on('uploaded-photos', function(event, args) {
    //If the place to which photos were added is not this one, select that one.
    if(args.place._id != $scope.selectedPlaceId) {
      tripsFactory.setSelectedPlace(args.place);
    }
    var params = {
      place_id: args.place._id,
      limit: args.number  // fetch the correct number of new images
    };
    // fetch photos newer than the current newest
    var newest = $scope.photos[args.place._id][0];
    if(newest !== undefined) {
      params.timeafter = newest.timestamp;
    }
    imageFactory.getPhotos(params, function(photos) {
      for(var i = 0; i < photos.length; i++) {
        $scope.photos[args.place._id].unshift(photos[i]);
      }
    });
  });

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

  // Load first set of images for a place. More will be loaded on scroll.
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
