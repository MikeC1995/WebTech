'use strict';

var modals = angular.module('modals');
modals.directive('addPlaceMapDirective', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id' // id of directive instance to register map to
      },
      link: function($scope, elem, attrs) {
        // Loads google map script
        loadGoogleMapAPI.then(function () {
            $scope.initialize();
        }, function () {
            console.error("Couldn't load Google Maps API!");
        });

        $scope.initialize = function() {
          $scope.map = new google.maps.Map(document.getElementById($scope.mapId), {
            zoom: 4,
            center: {lat: 49.198353, lng: 9.767022},
            disableDefaultUI: true
          });

          // Places Search Box code:
          // https://developers.google.com/maps/documentation/javascript/examples/places-searchbox

          // Create the search box and link it to the UI element.
          var input = elem.parent().find('#add-place-search')[0];
          var searchBox = new google.maps.places.SearchBox(input);
          $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          // Bias the SearchBox results towards current map's viewport.
          $scope.map.addListener('bounds_changed', function() {
            searchBox.setBounds($scope.map.getBounds());
          });

          var markers = [];

          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              // Create a marker for each place.
              markers.push(new google.maps.Marker({
                map: $scope.map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              }));

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            $scope.map.fitBounds(bounds);
          });
        }
      }
  };
}]);
