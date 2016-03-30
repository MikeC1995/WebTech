'use strict';

var trips = angular.module('trips');
trips.factory('tripsFactory2', ['$rootScope', 'apiFactory', function tripsFactory($rootScope, apiFactory) {
  var tripsFactory = {};

  var tripsDirty = true;
  var placesDirty = true;
  var trips = [];
  var places = [];

  tripsFactory.getTrips = new Promise(function(resolve, reject) {
    if(tripsDirty) {
      // Initial fetch of trips
      apiFactory.getTrips()
        .then(function(response) {
          trips = response.data.data;
          tripsDirty = false;
          resolve(trips);
        }, function(error) {
          // TODO: handle connection error
          console.error("Unable to fetch trips");
          reject();
        });
    } else {
      resolve(trips);
    }
  });

  tripsFactory.getPlaces = new Promise(function(resolve, reject) {
    if(placesDirty) {
      // Initial fetch of trips
      apiFactory.getPlaces()
        .then(function(response) {
          places = response.data.data;
          placesDirty = false;
          resolve(places);
        }, function(error) {
          // TODO: handle connection error
          console.error("Unable to fetch places");
          reject();
        });
    } else {
      resolve(places);
    }
  });

  // expose apiFactory.addPlace
  tripsFactory.addPlace = function(place) {
    return new Promise(function(resolve, reject) {
      apiFactory.addPlace(place)
        .then(function(data) {
          apiFactory.getPlaces().then(function(response) {
            places = response.data.data;
            resolve(places);
          });
        }, function(error) {
          //TODO handle error
          console.error('Unable to add place!');
          reject();
        });
    });
  };

  tripsFactory.deletePlace = function(place) {
    return new Promise(function(resolve, reject) {
      apiFactory.deletePlace(place)
        .then(function(data) {
          apiFactory.getPlaces().then(function(response) {
            places = response.data.data;
            resolve(places);
          });
        }, function(error) {
          //TODO handle error
          console.error("Unable to delete place!");
          reject();
        });
    });
  }


  tripsFactory.addTrip = function(tripName) {
    if (tripName) {
      var trip = {
        name: tripName.toUpperCase(),
        // if run out of trip colours, will default to black
        colour: $rootScope.defaultTripColours[trips.length] || '#000'
      };
      return new Promise(function(resolve, reject) {
        apiFactory.addTrip(trip)
          .then(function(data) {
            apiFactory.getTrips().then(function(response) {
              trips = response.data.data;
              resolve(trips);
            });
          }, function(error) {
            //TODO handle error
            console.error('Unable to add trip! :(');
            reject();
          });
      });
    }
  };

  tripsFactory.deleteTrip = function(trip) {
    return new Promise(function(resolve, reject) {
      apiFactory.deleteTrip(trip)
        .then(function(data) {
          apiFactory.getTrips().then(function(response) {
            trips = response.data.data;
            resolve(trips);
          });
        }, function(error) {
          // TODO: handle error
          console.error('Unable to delete trip! :(');
          reject();
        });
    });
  }

  return tripsFactory;
}]);
