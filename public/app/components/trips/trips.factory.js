'use strict';

var trips = angular.module('trips');
trips.factory('tripsFactory', ['$http', 'apiFactory', function tripsFactory($http, apiFactory) {
  var tripsFactory = {};

  var trips = []; // a list of trip objects fetched from the server
  var places = []; // a list of place objects fetched from the server

  // Initial fetch of trips
  apiFactory.getTrips()
    .then(function(response) {
      trips = response.data.data;
    }, function(error) {
      // TODO: handle connection error
      trips = [];
    });

  // Initial fetch of places
  apiFactory.getPlaces()
    .then(function(response) {
      places = response.data.data;
    }, function(error) {
      // TODO: handle connection error
      places = [];
    });


  // PUBLIC METHODS

  // If callback is specified, fetches trips from server
  // Otherwise, returns local trips object
  tripsFactory.getTrips = function(callback) {
    if(callback !== undefined) {
      apiFactory.getTrips()
        .then(function(response) {
          trips = response.data.data;
          callback(trips);
        }, function(error) {
          // TODO handle error
          console.error("error getting trips");
        });
    } else {
      return trips;
    }
  }

  // If callback is specified, fetches places from server
  // Otherwise, returns local places object
  tripsFactory.getPlaces = function(callback) {
    if(callback !== undefined) {
      apiFactory.getPlaces()
        .then(function(response) {
          places = response.data.data;
          callback(places);
        }, function(error) {
          // TODO handle error
          console.error("error getting places");
        });
    } else {
      return places;
    }
  }

  tripsFactory.addTrip = function(tripName) {
    if (tripName) {
      var trip = {
        name: tripName.toUpperCase()
      };
      apiFactory.addTrip(trip)
        .then(function(data) {
          apiFactory.getTrips().then(function(response) {
            trips = response.data.data;
          });
        }, function(error) {
          //TODO handle error
          alert('Unable to add trip! :(');
        });
    }
  };

  tripsFactory.addPlace = function(placeName, trip_id) {
    if (placeName) {
      var place = {
        name: placeName,
        trip_id: trip_id
      };
      apiFactory.addPlace(place)
        .then(function(data) {
          apiFactory.getPlaces().then(function(response) {
            places = response.data.data;
          });
        }, function(error) {
          //TODO handle error
          alert('Unable to add place! :(');
        });
    }
  };

  return tripsFactory;
}]);
