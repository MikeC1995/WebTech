'use strict';

var trips = angular.module('trips');
trips.factory('tripsFactory', ['$rootScope', 'apiFactory', function tripsFactory($rootScope, apiFactory) {
  var tripsFactory = {};

  var trips = []; // a list of trip objects fetched from the server
  var places = []; // a list of place objects fetched from the server
  var selectedTrip = {};
  var selectedPlace = {};

  // Initial fetch of trips
  apiFactory.getTrips()
    .then(function(response) {
      trips = response.data.data;
      // initially selected trip
      if(trips.length > 0) selectedTrip = trips[0];
    }, function(error) {
      // TODO: handle connection error
    });

  // Initial fetch of places
  apiFactory.getPlaces()
    .then(function(response) {
      places = response.data.data;
      // initially selected place
      if(places.length > 0) selectedPlace = places[0];
    }, function(error) {
      // TODO: handle connection error
    });


  // PUBLIC METHODS
  tripsFactory.getSelectedTrip = function() {
    return selectedTrip;
  }
  tripsFactory.setSelectedTrip = function(trip) {
    for(var i = 0; i < trips.length; i++) {
      if(trips[i]._id == trip._id) {
        selectedTrip = trips[i];
      }
    }
  }
  tripsFactory.getSelectedPlace = function() {
    return selectedPlace;
  }
  tripsFactory.setSelectedPlace = function(place) {
    for(var i = 0; i < places.length; i++) {
      if(places[i]._id == place._id) {
        selectedPlace = places[i];
      }
    }
  }

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

  // expose apiFactory.addPlace
  tripsFactory.addPlace = function(place) {
    apiFactory.addPlace(place)
      .then(function(data) {
        apiFactory.getPlaces().then(function(response) {
          places = response.data.data;
        });
      }, function(error) {
        //TODO handle error
        alert('Unable to add place! :(');
      });
  };

  // expose apiFactory.deletePlace
  tripsFactory.deletePlace = function(place) {
    apiFactory.deletePlace(place)
      .then(function(data) {
        apiFactory.getPlaces().then(function(response) {
          places = response.data.data;
        });
      }, function(error) {
        //TODO handle error
        alert("Unable to delete place!")
      });
  }

  return tripsFactory;
}]);
