'use strict';

var map = angular.module('map');
map.directive('tripMap', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id', // id of directive instance to register map to
        getTripsFn: '&getTripsFn',
        getPlacesFn: '&getPlacesFn'
      },
      link: function($scope, elem, attrs) {
        // getTripsFn and getPlacesFn are getter functions which return the actual
        // getTrips/getPlaces functions themselves
        $scope.getTrips = $scope.getTripsFn();
        $scope.getPlaces = $scope.getPlacesFn();
        $scope.trips = [];
        $scope.places = [];
        $scope.markers = [];
        $scope.connectors = [];

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

          $scope.places = $scope.getPlaces();
          $scope.trips = $scope.getTrips();
          
          // Watch for changes on the bound trips + places
          // NB: called in initialize as 'google' object must be defined
          $scope.$watch(function() { return $scope.getPlaces().length; }, function(_new, old) {
            $scope.places = $scope.getPlaces();
            updateMapDrawings();
          });
          $scope.$watch(function() { return $scope.getTrips().length; }, function(_new, old) {
            $scope.trips = $scope.getTrips();
            updateMapDrawings();
          });
        }

        // redraw all the markers and connectors on the map
        function updateMapDrawings() {
          clearMapDrawings();

          // ADD THE MARKERS
          for(var p = 0; p < $scope.places.length; p++) {
            var marker = new google.maps.Marker({
              position: {lat: $scope.places[p].location.lat, lng: $scope.places[p].location.lng},
              map: $scope.map,
              icon: {
                url: '/assets/images/icons/marker.png',
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15) //anchor is the center of the marker
              }
            });
            $scope.markers.push(marker);
          }

          // ADD THE CONNECTORS
          var tripIds = []; // array of trip ids
          var sortedPlaces = [];  // array of same length where each entry is an array of places for that trip
          for(var t = 0; t < $scope.trips.length; t++) {
            tripIds.push($scope.trips[t]._id);
            sortedPlaces.push([]);
          }
          for(var i = 0; i < $scope.places.length; i++) {
            sortedPlaces[tripIds.indexOf($scope.places[i].trip_id)].push($scope.places[i]);
          }

          // for each trip's places, sort them by date and draw the connector between them
          for(var i = 0; i < sortedPlaces.length; i++) {
            // sort places by from_date
            sortedPlaces[i].sort(function(a, b) {
              if(a.from_date < b.from_date) {
                return -1;
              } else if(a.from_date > b.from_date) {
                return 1;
              } else {
                return 0;
              }
            });

            // draw connections between places
            if(sortedPlaces[i].length >= 2) {
              for(var j = 1; j < sortedPlaces[i].length; j++) {
                var connector = new google.maps.Polyline({
                  path: [{lat: sortedPlaces[i][j-1].location.lat,
                          lng: sortedPlaces[i][j-1].location.lng },
                         {lat: sortedPlaces[i][j].location.lat,
                          lng: sortedPlaces[i][j].location.lng }],
                  geodesic: true,
                  strokeColor: '#FF0000',
                  strokeOpacity: 1,
                  strokeWeight: 4
                });
                connector.setMap($scope.map);
                $scope.connectors.push(connector);
              }
            }
          }
        }

        // clear the marker and connector objects from the map
        function clearMapDrawings() {
          for(var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(null);
          }
          $scope.markers = [];
          for(var i = 0; i < $scope.connectors.length; i++) {
            $scope.connectors[i].setMap(null);
          }
          $scope.connectors = [];
        }
      }
  };
}]);
