'use strict';

var map = angular.module('map');
map.controller('mapController', ['$scope', 'tripsFactory', 'imageFactory', function($scope, tripsFactory, imageFactory) {
  $scope.selectedPhotoIndex = 0;
  $scope.photos = [];

  // function bindings
  $scope.trips = tripsFactory.getTrips;
  $scope.places = tripsFactory.getPlaces;
  $scope.getSelectedTrip = tripsFactory.getSelectedTrip;

  // update photos when selected place changes
  $scope.$watch(function() {
    return tripsFactory.getSelectedPlace();
  }, function(value) {
    if(value !== undefined) {
      loadInitial();
    }
    $scope.selectedPhotoIndex = 0;
  });

  $scope.tripColor = function() {
    return {
      'background-color': $scope.selectedTrip().colour
    }
  }

  // return the currently selected place
  $scope.selectedPlace = function() {
    return tripsFactory.getSelectedPlace();
  }

  // return the currently selected place
  $scope.selectedTrip = function() {
    return tripsFactory.getSelectedTrip();
  }

  $scope.incrementSelectedPlace = function() {
    var ps = $scope.places();
    var idx = -1;
    for(var i = 0; i < ps.length; i++) {
      if(ps[i]._id == $scope.selectedPlace()._id) {
        idx = i;
      }
    }
    if(idx == -1) {
      idx = 0;
    } else if(idx == ps.length - 1) {
      idx = 0;
    } else {
      idx += 1;
    }

    tripsFactory.setSelectedPlace(ps[idx]);
  }

  $scope.decrementSelectedPlace = function() {
    var ps = $scope.places();
    var idx = -1;
    for(var i = 0; i < ps.length; i++) {
      if(ps[i]._id == $scope.selectedPlace()._id) {
        idx = i;
      }
    }
    if(idx == -1) {
      idx = 0;
    } else if(idx == 0) {
      idx = ps.length - 1;
    } else {
      idx -= 1;
    }

    tripsFactory.setSelectedPlace(ps[idx]);
  }

  $scope.nextPhoto = function() {
    $scope.selectedPhotoIndex += 1;
    if($scope.selectedPhotoIndex > $scope.photos.length - 1) {
      $scope.selectedPhotoIndex = 0;
      $scope.incrementSelectedPlace();
      loadInitial();
    }
  }
  $scope.prevPhoto = function() {
    $scope.selectedPhotoIndex -= 1;
    if($scope.selectedPhotoIndex < 0) {
      $scope.decrementSelectedPlace();
      loadInitial(function() {
        $scope.selectedPhotoIndex = $scope.photos.length - 1;
      });
    }
  }

  // format and ISO date into dd/mm/yyyy
  $scope.formatDate = function(iso_date) {
    var date = new Date(iso_date);
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
  }

  // Load first set of images for a place. More will be loaded on scroll.
  function loadInitial(cb) {
    // TODO: limit 80 to guarantee div filled. However, need to
    // limit by the size of the gallery and # thumbs that will fit!
    var params = {
      place_id: $scope.selectedPlace()._id,
      timebefore: Date.now(),
      limit: 80
    };
    imageFactory.getPhotos(params, function(photos) {
      $scope.photos = photos;
      if(cb !== undefined) {
        cb();
      }
    });
  }

  // load more images (as the user scrolls)
  $scope.loadMore = function() {
    var place_id = $scope.selectedPlace()._id;
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
}]);
