'use strict';

var map = angular.module('map');
map.controller('mapController', ['$rootScope', '$scope', '$state',
  'userFactory', 'tripDataFactory', 'imageFactory',
  function($rootScope, $scope, $state, userFactory, tripDataFactory, imageFactory) {
    // Expose utility methods
    $scope.formatDate = Utilities.formatDate;

    $scope.selected = new tripDataFactory.Selected();

    // https://coderwall.com/p/ngisma/safe-apply-in-angular-js
    $scope.safeApply = function(fn) {
      if(!this.$root) return;
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    // Local copies
    $scope.trips = [];
    $scope.places = [];
    $scope.selectedPlaceIndex = 0;

    // Getters
    $scope.getTrips = function() { return $scope.trips; }
    $scope.getPlaces = function() { return $scope.places; }

    // Initialise
    function updateTrips() {
      tripDataFactory.getTrips().then(function(trips) {
        $scope.trips = trips;
        $scope.selected.setTrip(trips[0]);
        $scope.safeApply();
      }, function(err) {
        console.error("Error on trips promise");
      });
    }

    function updatePlaces() {
      tripDataFactory.getPlaces().then(function(places) {
        $scope.places = places;
        $scope.selected.setPlace(places[0]);
        $scope.safeApply();
      }, function(err) {
        console.error("Error on places promise");
      });
    }

    updateTrips();
    updatePlaces();
    $rootScope.$on("trips.updated", updateTrips);
    $rootScope.$on("places.updated", updatePlaces);

    $scope.selectedPhotoIndex = 0;
    $scope.photos = [];
    $scope.filteredPlaces = [];

    // update photos and selected index when selected place changes
    $rootScope.$on("selected.updated", function() {
      $scope.filteredPlaces = $scope.places.filter(function(place) {
        return place.trip_id == $scope.selected.getPlace().trip_id;
      });

      for(var i = 0; i < $scope.filteredPlaces.length; i++) {
        if($scope.filteredPlaces[i]._id == $scope.selected.getPlace()._id) {
          $scope.selectedPlaceIndex = i;
        }
      }
      $scope.photos = [];
      if($scope.selected.getPlace()) {
        loadInitial();
      }
      $scope.selectedPhotoIndex = 0;
      $scope.updateTransform();
    });

    $scope.tripColor = function() {
      return $scope.selected.getTrip().colour;
    }

    $scope.selectPlace = function(place) {
      $scope.selected.setPlace(place);
      $scope.safeApply();
    }

    $scope.incrementSelectedPlace = function() {
      var p = $scope.selected.getAdjacentPlace($scope.selected.getPlace(), 1);
      $scope.selected.setPlace(p);
      $scope.safeApply();
    }

    $scope.decrementSelectedPlace = function() {
      var p = $scope.selected.getAdjacentPlace($scope.selected.getPlace(), -1);
      $scope.selected.setPlace(p);
      $scope.safeApply();
    }

    $scope.nextPhoto = function() {
      $scope.selectedPhotoIndex += 1;
      if($scope.selectedPhotoIndex > $scope.photos.length - 1) {
        $scope.selectedPhotoIndex = 0;
        $scope.incrementSelectedPlace();
      } else {
        $scope.safeApply();
      }
    }
    $scope.prevPhoto = function() {
      $scope.selectedPhotoIndex -= 1;
      if($scope.selectedPhotoIndex < 0) {
        $scope.selectedPhotoIndex = 0;
        $scope.decrementSelectedPlace();
      } else {
        $scope.safeApply();
      }
    }

    $scope.keydown = function(keycode) {
      switch(keycode) {
        case 13:  //enter
          $scope.selectPhoto($scope.selectedPhotoIndex);
          break;
        case 37:  // left
          $scope.prevPhoto();
          break;
        case 39:  // right
          $scope.nextPhoto();
          break;
        case 38:  // up
          $scope.decrementSelectedPlace();
          break;
        case 40:  // down
          $scope.incrementSelectedPlace();
          break;
        case 27:  // escape
          $scope.close();
          break;
      }
    }

    // Load first set of images for a place. More will be loaded on scroll.
    function loadInitial(cb) {
      // TODO: limit 80 to guarantee div filled. However, need to
      // limit by the size of the gallery and # thumbs that will fit!
      var params = {
        place_id: $scope.selected.getPlace()._id,
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
      var place_id = $scope.selected.getPlace()._id;
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
