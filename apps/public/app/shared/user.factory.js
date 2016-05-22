'use strict';

var app = angular.module('app');

app.factory('userFactory', ['apiFactory', '$window', '$stateParams', '$q', function(apiFactory, $window, $stateParams, $q) {
  var userFactory = {};

  var me; // stores the authenticated user's object
  var isGuest = false;

  apiFactory.getUser().then(function(response) {
    isGuest = false;
    me = response.data.data;
  }, function() {
    // Not logged in

    // if path is empty then redirect to login
    if($window.location.pathname == "/") {
      $window.location.href = "/login";
    }
    isGuest = true;
  });

  userFactory.isGuest = function() {
    return isGuest;
  }

  // Logout from the server and reload page
  userFactory.logout = function() {
    apiFactory.logout().then(function() {
      $window.location.reload();
    }, function(err) {
      $window.location.reload();
    });
  }

  // Get the authenticated user's object
  userFactory.getMe = function() {
    return new Promise(function(resolve, reject) {
      if(me) {
        resolve(me);
      } else {
        apiFactory.getUser().then(function(response) {
          me = response.data.data;
          resolve(me);
        }, function() {
          reject();
        });
      }
    });
  }

  // Get a user object by id
  // If not specified, returns the current user (being viewed) object
  userFactory.getUser = function(user_id) {
    if(!user_id) {
      user_id = $stateParams.user_id;
    }
    return new Promise(function(resolve, reject) {
      apiFactory.getUser(user_id).then(function(response) {
        resolve(response.data.data);
      }, function() {
        reject();
      });
    });
  }

  // Set whether a user map is public or friends only
  userFactory.setUserPublic = function(isPublic) {
    return new Promise(function(resolve, reject) {
      if(me) {
        apiFactory.setUser({
          public: isPublic
        }).then(function() {
          // success, now update me user object
          apiFactory.getUser().then(function(response) {
            me = response.data.data;
            resolve();
          }, function() {
            reject();
          });
        }, function() {
          console.log("error");
          reject();
        });
      } else {
        reject();
      }
    });
  }

  // Returns the URL of the profile picture for the specified user
  // If none specified, returns authenticated user's profile picture.
  userFactory.getProfilePicture = function(user) {
    var fbBaseUrl = "https://graph.facebook.com/v2.6/";
    if(!user || !user.facebookID || !user.accessToken) {
      if(!me || !me.facebookID || !me.accessToken) {
        return "";
      }
      user = me;
    }
    return fbBaseUrl + user.facebookID + "/picture?width=200&height=200&access_token=" + user.accessToken;
  }

  // Get a list of the authenticated user's friends
  userFactory.getFriends = function() {
    return new Promise(function(resolve, reject) {
      apiFactory.getFriends(me).then(function(response) {
        var friends = response.data.data;
        // Fetch each friend's object using their facebook IDs
        var promises = [];
        for(var i = 0; i < friends.length; i++) {
          promises.push(apiFactory.getUser(friends[i].id, true));
        }
        $q.all(promises).then(function(users) {
          for(var i = 0; i < users.length; i++) {
            friends[i].accessToken = me.accessToken;
            friends[i].facebookID = friends[i].id;
            friends[i].id = users[i].data.data._id;
          }
        });
        resolve(friends);
      }, function(err) {
        reject();
      });
    });
  }

  return userFactory;
}]);
