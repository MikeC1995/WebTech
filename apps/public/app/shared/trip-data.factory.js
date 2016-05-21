'use strict';

// Factory which maintains a consistent list of trips and places fetched from
// server, which other modules can tap into

var trips = angular.module('trips');
trips.factory('tripDataFactory', ['$rootScope', 'apiFactory', '$stateParams', function tripDataFactory($rootScope, apiFactory, $stateParams) {
  var tripDataFactory = {};

  var trips = undefined;
  var places = undefined;

  $rootScope.$watch(function() {
    return $stateParams.user_id;
  }, function(user_id) {
    initialise();
  });

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

    // compute the index of the adjacent place thats in the *same* trip
    // inc = 1 for next, -1 for previous place.
    this.getAdjacentPlace = function(place, inc) {
      if(!trips || !places) { return; }
      if(inc > 1) inc = 1;
      if(inc < 1) inc = -1;

      for(var i = 0; i < places.length; i++) {
        if(places[i]._id == place._id) {
          var adjIdx = i;
          do {
            adjIdx += inc;
            if(adjIdx < 0) {
              adjIdx = places.length - 1;
            } else if(adjIdx > places.length - 1) {
              adjIdx = 0;
            }
          } while(places[adjIdx].trip_id != places[i].trip_id);
          return places[adjIdx];
        }
      }
      return null;
    }
  }

  tripDataFactory.getTrips = function() {
    return new Promise(function(resolve, reject) {
      if(trips) {
        resolve(trips);
      } else {
        apiFactory.getTrips($stateParams.user_id)
          .then(function(response) {
            trips = response.data.data;
            resolve(trips);
          }, function() {
            reject();
          });
      }
    });
  }

  // sort an array of places (from various trips) by their trip and by their from_date
  function sortPlacesByDate(places) {
    var sorted = [];
    // get list of trip_ids
    var trip_ids = [];
    for(var p = 0; p < places.length; p++) {
      if(trip_ids.indexOf(places[p].trip_id) == -1) {
        trip_ids.push(places[p].trip_id);
      }
    }
    // filter places by trip and sort by date before pushing chunk to sorted list
    for(var t = 0; t < trip_ids.length; t++) {
      var filtered = places.filter(function(place) {
        return place.trip_id == trip_ids[t];
      });
      filtered.sort(function(a,b) {
        return new Date(a.from_date) - new Date(b.from_date);
      });
      sorted.push.apply(sorted, filtered);
    }
    return sorted;
  }

  tripDataFactory.getPlaces = function() {
    return new Promise(function(resolve, reject) {
      if(places) {
        resolve(places);
      } else {
        apiFactory.getPlaces($stateParams.user_id)
          .then(function(response) {
            places = sortPlacesByDate(response.data.data);
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
          apiFactory.getPlaces($stateParams.user_id).then(function(response) {
            places = sortPlacesByDate(response.data.data);
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

  tripDataFactory.updatePlace = function(place) {
    return new Promise(function(resolve, reject) {
      apiFactory.updatePlace(place)
        .then(function(data) {
          apiFactory.getPlaces($stateParams.user_id).then(function(response) {
            places = sortPlacesByDate(response.data.data);
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
          apiFactory.getPlaces($stateParams.user_id).then(function(response) {
            places = sortPlacesByDate(response.data.data);
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
            apiFactory.getTrips($stateParams.user_id).then(function(response) {
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
          apiFactory.getTrips($stateParams.user_id).then(function(response) {
            trips = response.data.data;
            // Must update places too as deleting a trip will affect these
            apiFactory.getPlaces($stateParams.user_id).then(function(response) {
              places = sortPlacesByDate(response.data.data);
              resolve(trips);
              broadcast("trips");
              broadcast("places");
            }, function(error) {
              console.error('Unable to delete trip!');
              reject();
            });
          });
        }, function(error) {
          // TODO: handle error
          console.error('Unable to delete trip!');
          reject();
        });
    });
  }

  tripDataFactory.updateTrip = function(trip) {
    trip.name = trip.name.toUpperCase();
    return new Promise(function(resolve, reject) {
      apiFactory.updateTrip(trip).then(function() {
          apiFactory.getTrips($stateParams.user_id).then(function(response) {
            trips = response.data.data;
            resolve(trips);
            broadcast("trips");
          });
        }, function(error) {
          // TODO: handle error
          console.error('Unable to delete trip!');
          reject();
        });
    });
  }

  // Initialise factory and return tripDataFactory if successful
  function onErr() { console.error("Unable to initialise tripDataFactory");}
  function initialise() {
    apiFactory.getTrips($stateParams.user_id)
      .then(function(response) {
        trips = response.data.data;
        apiFactory.getPlaces($stateParams.user_id)
          .then(function(response) {
            places = sortPlacesByDate(response.data.data);
            broadcast("trips");
            broadcast("places");
          }, onErr);
      }, onErr);
  }
  initialise();
  return tripDataFactory;
}]);
