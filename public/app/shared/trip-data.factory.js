'use strict';

// Factory which maintains a consistent list of trips and places fetched from
// server, which other modules can tap into

var trips = angular.module('trips');
trips.factory('tripDataFactory', ['$rootScope', 'apiFactory', function tripDataFactory($rootScope, apiFactory) {
  var tripDataFactory = {};

  var trips = undefined;
  var places = undefined;

  function broadcast(what) {
    if(what != "trips" && what != "places") {
      return;
    }
    $rootScope.$broadcast(what + ".updated");
  }

  tripDataFactory.Selected = function() {
    var _trip = {};
    var _place = {};

    this.getTrip = function() { return _trip; }
    this.getPlace = function() { return _place; }
    this.setTrip = function(trip) {
      if(!trips || !places) { return; }

      for(var i = 0; i < trips.length; i++) {
        if(trips[i]._id == trip._id) {
          _trip = trips[i];
          for(var j = 0; j < places.length; j++) {
            if(places[j].trip_id == trip._id) {
              _place = places[j];
              return;
            }
          }
          return;
        }
      }
    }
    this.setPlace = function(place) {
      if(!trips || !places) { return; }

      for(var i = 0; i < places.length; i++) {
        if(places[i]._id == place._id) {
          _place = places[i];
          for(var j = 0; j < trips.length; j++) {
            if(trips[j]._id == _place.trip_id) {
              _trip = trips[j];
              return;
            }
          }
          return;
        }
      }
    }
  }

  tripDataFactory.getTrips = function() {
    return new Promise(function(resolve, reject) {
      if(trips) {
        resolve(trips);
      } else {
        apiFactory.getTrips()
          .then(function(response) {
            trips = response.data.data;
            resolve(trips);
          }, function() {
            reject();
          });
      }
    });
  }

  tripDataFactory.getPlaces = function() {
    return new Promise(function(resolve, reject) {
      if(places) {
        resolve(places);
      } else {
        apiFactory.getPlaces()
          .then(function(response) {
            places = response.data.data;
            resolve(places);
          }, function() {
            reject();
          });
      }
    });
  }

  // expose apiFactory.addPlace
  tripDataFactory.addPlace = function(place) {
    return new Promise(function(resolve, reject) {
      apiFactory.addPlace(place)
        .then(function(data) {
          apiFactory.getPlaces().then(function(response) {
            places = response.data.data;
            resolve(places);
            broadcast("places");
          });
        }, function(error) {
          //TODO handle error
          console.error('Unable to add place!');
          reject();
        });
    });
  };

  tripDataFactory.deletePlace = function(place) {
    return new Promise(function(resolve, reject) {
      apiFactory.deletePlace(place)
        .then(function(data) {
          apiFactory.getPlaces().then(function(response) {
            places = response.data.data;
            resolve(places);
            broadcast("places");
          });
        }, function(error) {
          //TODO handle error
          console.error("Unable to delete place!");
          reject();
        });
    });
  }


  tripDataFactory.addTrip = function(tripName) {
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
              broadcast("trips");
            });
          }, function(error) {
            //TODO handle error
            console.error('Unable to add trip! :(');
            reject();
          });
      });
    }
  };

  tripDataFactory.deleteTrip = function(trip) {
    return new Promise(function(resolve, reject) {
      apiFactory.deleteTrip(trip)
        .then(function(data) {
          apiFactory.getTrips().then(function(response) {
            trips = response.data.data;
            resolve(trips);
            broadcast("trips");
          });
        }, function(error) {
          // TODO: handle error
          console.error('Unable to delete trip! :(');
          reject();
        });
    });
  }

  // Initialise factory and return tripDataFactory if successful
  function onErr() { console.error("Unable to initialise tripDataFactory");}
  apiFactory.getTrips()
    .then(function(response) {
      trips = response.data.data;
      apiFactory.getPlaces()
        .then(function(response) {
          places = response.data.data;
          broadcast("trips");
          broadcast("places");
        }, onErr);
    }, onErr);
  return tripDataFactory;
}]);