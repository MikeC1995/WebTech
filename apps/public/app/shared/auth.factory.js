'use strict';

var app = angular.module('app');

app.factory('authFactory', ['apiFactory', '$window', '$stateParams', '$q', function(apiFactory, $window, $stateParams, $q) {
  var authFactory = {};

  var me;
  apiFactory.getUser().then(function(_user) {
    me = _user.data.data;
  }, function() {
    // TODO: handle error
    console.log("Error getting user!");
  });

  authFactory.logout = function() {
    apiFactory.logout().then(function() {
      $window.location.reload();
    }, function(err) {
      $window.location.reload();
    });
  }
  authFactory.me = function() {
    return new Promise(function(resolve, reject) {
      if(me) {
        resolve(me);
      } else {
        apiFactory.getUser().then(function(_user) {
          me = _user.data.data;
          resolve(me);
        }, function() {
          reject();
        });
      }
    });
  }
  authFactory.user = function(user_id) {
    if(!user_id) {
      user_id = $stateParams.user_id;
    }
    return new Promise(function(resolve, reject) {
      apiFactory.getUser(user_id).then(function(user) {
        user = user.data.data;
        resolve(user);
      }, function() {
        reject();
      });
    });
  }
  authFactory.getProfileUrl = function(user) {
    if(user) {
      return "https://graph.facebook.com/v2.6/" + user.facebookID + "/picture" + "?width=200&height=200" + "&access_token=" + user.accessToken;
    } else if(me) {
      return "https://graph.facebook.com/v2.6/" + me.facebookID + "/picture" + "?width=200&height=200" + "&access_token=" + me.accessToken;
    }
    return "";
  }

  authFactory.getFriends = function() {
    return new Promise(function(resolve, reject) {
      apiFactory.getFriends(me).then(function(friends) {
        friends = friends.data.data;
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

  return authFactory;
}]);
