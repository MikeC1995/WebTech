'use strict';

var map = angular.module('map');
map.directive('tripMap', ['loadGoogleMapAPI', 'tripDataFactory', '$rootScope', function(loadGoogleMapAPI, tripDataFactory, $rootScope) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id', // id of directive instance to register map to
        selected: '=selected'
      },
      link: function($scope, elem, attrs) {
        $scope.trips = [];
        $scope.places = [];
        $scope.markers = [];
        $scope.connectors = [];

        // Initialise
        function update() {
          return new Promise(function(resolve, reject) {
            tripDataFactory.getTrips().then(function(trips) {
              $scope.trips = trips;
              $scope.selected.setTrip(trips[0]);
              tripDataFactory.getPlaces().then(function(places) {
                $scope.places = places;
                $scope.selected.setPlace(places[0]);
                $scope.$apply();
                resolve();
              }, function(err) {
                reject();
              });
            }, function(err) {
              reject();
            });
          });
        }

        $rootScope.$on("trips.updated", function() { update().then(updateMapDrawings); });
        $rootScope.$on("places.updated", function() { update().then(updateMapDrawings); });

        function computeMarkerSize() {
          var maxMarkerSize = 30;
          var markerSize = Math.round(Math.pow(2, $scope.map.getZoom()));
          if(markerSize > maxMarkerSize) markerSize = maxMarkerSize;
          return markerSize;
        }

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
            disableDefaultUI: true,
            zoomControl: true
          });

          // pan map when location changes
          $scope.$watch(function() {
            return $scope.selected.getPlace()._id;
          }, function() {
            var place = $scope.selected.getPlace().location;
            if(place && place.lat && place.lng) {
              $scope.map.panTo($scope.selected.getPlace().location);
            }
          });

          // update marker sizes when zoom changes
          google.maps.event.addListener($scope.map, 'zoom_changed', function() {
            var markerSize = computeMarkerSize();
            $scope.markers.forEach(function(marker) {
              //change the size of the icon
              marker.setIcon({
                anchor: new google.maps.Point(markerSize/2, markerSize/2),  // anchor
                scaledSize: new google.maps.Size(markerSize, markerSize), //scaleSize
                url: marker.getIcon().url //url
              });
            });
          });

          update().then(updateMapDrawings);
        }

        // redraw all the markers and connectors on the map
        function updateMapDrawings() {
          clearMapDrawings();

          // ADD THE MARKERS
          for(var p = 0; p < $scope.places.length; p++) {
            // Get the trip associated with the place
            var trip;
            for(var t = 0; t < $scope.trips.length; t++) {
              if($scope.places[p].trip_id == $scope.trips[t]._id) {
                trip = $scope.trips[t];
                break;
              }
            }
            if(trip === undefined) return;

            var markerSize = computeMarkerSize();
            var marker = new google.maps.Marker({
              position: {lat: $scope.places[p].location.lat, lng: $scope.places[p].location.lng},
              map: $scope.map,
              icon: {
                url: '/assets/images/icons/marker-' + trip.colour.slice(1) + '.png',
                scaledSize: new google.maps.Size(markerSize, markerSize),
                anchor: new google.maps.Point(markerSize/2, markerSize/2) //anchor is the center of the marker
              },
              tripmap_place: $scope.places[p]   // non-googlemaps property for internal use
            });
            marker.addListener('click', function() {
              $scope.selected.setPlace(this.tripmap_place);
              $scope.$apply();
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
                  strokeColor: $scope.trips[i].colour,
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

        // pan map when selected place changes
        $scope.$watch(function() {
          return $scope.selected.getPlace()._id;
        }, function(value) {
          for(var i = 0; i < $scope.markers.length; i++) {
            if($scope.markers[i].tripmap_place._id == value) {
              $scope.map.panTo($scope.markers[i].position);
              return;
            }
          }
        });
      }
  };
}]);
