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
          var maxMarkerSize = 20;
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
            zoom: 5,
            minZoom: 3,
            center: {lat: 49.198353, lng: 9.767022},
            disableDefaultUI: true,
            zoomControl: true
          });

          // pan map when location changes
          $scope.$watch(function() {
            return $scope.selected.getPlace()._id;
          }, function(new_place_id, old_place_id) {
            var place = $scope.selected.getPlace();
            if(place && place.location && place.location.lat && place.location.lng) {
              $scope.map.panTo($scope.selected.getPlace().location);

              // trigger select event for the place's marker to trigger its animation
              for(var m = 0; m < $scope.markers.length; m++) {
                if($scope.markers[m].args.place._id == $scope.selected.getPlace()._id) {
                  $scope.markers[m].trigger("selected");
                }
              }
            }
          });

          // update marker sizes when zoom changes
          google.maps.event.addListener($scope.map, 'zoom_changed', function() {
            var markerSize = computeMarkerSize();
            $scope.markers.forEach(function(marker) {
              marker.setSize(markerSize, markerSize);
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

            var marker = new CustomMarker(
              new google.maps.LatLng($scope.places[p].location),
          		$scope.map,
          		{
                width: 20,
                height: 20,
                bg: trip.colour,
                place: $scope.places[p]
              }
          	);

            var infoWindowContent = "";
            var infowindow = new google.maps.InfoWindow({
              content: infoWindowContent,
              pixelOffset: new google.maps.Size(0, -10)
            });

            $scope.markers.push(marker);
          }

          // When map loaded, add all marker event listeners
          google.maps.event.addListenerOnce($scope.map, 'idle', function() {
            // add event listeners
            for(var m = 0; m < $scope.markers.length; m++) {
              // Set selected place on click
              $scope.markers[m].listener("click", function(marker) {
                $scope.selected.setPlace(marker.args.place);
                $scope.$apply();
              });

              // Enlarge marker on mouse over and display infowindow
              $scope.markers[m].listener("mouseover", function(marker) {
                // set marker size
                var markerSize = computeMarkerSize() + 10;
                marker.setSize(markerSize, markerSize);

                // open info window
                var trip;
                for(var i = 0; i < $scope.trips.length; i++) {
                  if($scope.trips[i]._id == marker.args.place.trip_id) {
                    trip = $scope.trips[i];
                  }
                }
                if(!trips) return;

                var infoWindowContent =
                  '<div class="map-infowindow"> \
                    <span class="placename">' + marker.args.place.location.name + '</span> \
                    <span class="tripname">' + trip.name + '</span> \
                    <span class="dates">' + Utilities.formatDate(marker.args.place.from_date) + ' - ' + Utilities.formatDate(marker.args.place.to_date) + '</span> \
                  </div>';
                infowindow.setContent(infoWindowContent);
                infowindow.open($scope.map, marker);
              });

              // Reset marker size on mouseout and close infowindow
              $scope.markers[m].listener("mouseout", function(marker) {
                var markerSize = computeMarkerSize();
                marker.setSize(markerSize, markerSize);
                infowindow.close();
              });

              // Animate the marker when it becomes the selected place
              $scope.markers[m].listener("selected", function(marker) {
                for(var m = 0; m < $scope.markers.length; m++) {
                  $scope.markers[m].animate(false);
                }
                marker.animate(true);
              });
            }

            // set the initially selected marker
            for(var m = 0; m < $scope.markers.length; m++) {
              if($scope.markers[m].args.place._id == $scope.selected.getPlace()._id) {
                $scope.markers[m].trigger("selected");
              }
            }

            // set starting position of map to be the bounding box of the
            // all the places on the current trip
            if($scope.places.length > 0) {
              var bounds = new google.maps.LatLngBounds();
              for(var i = 0; i < $scope.places.length; i++) {
                if($scope.selected.getPlace().trip_id == $scope.places[i].trip_id) {
                  bounds.extend(new google.maps.LatLng($scope.places[i].location));
                }
              }
              $scope.map.fitBounds(bounds);
            }
          });

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
