'use strict';

var trips = angular.module('trips');
trips.factory('tripsFactory', ['$http', 'apiFactory', function tripsFactory($http, apiFactory) {
  var tripsFactory = {};

  var trips = []; // a list of trip objects fetched from the server
  var places = []; // a list of place objects fetched from the server
  tripsFactory.trips = function() { return trips; }
  tripsFactory.places = function() { return places; }

  getTrips();
  getPlaces();

  function getTrips() {
    apiFactory.getTrips()
        .success(function(data) {
            trips = data.data;
        })
        .error(function(error) {
          // TODO: handle connection error
          trips = [];
        });
  };

  function getPlaces() {
    apiFactory.getPlaces()
        .success(function(data) {
            places = data.data;
        })
        .error(function(error) {
          // TODO: handle connection error
          places = [];
        });
  };

  tripsFactory.addTrip = function(tripName) {
    if (tripName) {
      var trip = {
        name: tripName.toUpperCase()
      };
      apiFactory.addTrip(trip)
        .success(function(data) {
          getTrips();
        })
        .error(function(error) {
          //TODO handle error
          alert('Unable to add trip! :(');
        });
      console.log("ADD TRIP " + tripName.toUpperCase());
    }
  };

  tripsFactory.addPlace = function(placeName, trip_id) {
    if (placeName) {
      var place = {
        name: placeName,
        trip_id: trip_id
      };
      apiFactory.addPlace(place)
        .success(function(data) {
          getPlaces();
        })
        .error(function(error) {
          //TODO handle error
          alert('Unable to add place! :(');
        });
      console.log("ADD PLACE " + placeName.toUpperCase());
    }
  };

  return tripsFactory;
}]);
