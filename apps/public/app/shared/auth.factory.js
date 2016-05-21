'use strict';

var app = angular.module('app');

app.factory('authFactory', ['apiFactory', '$window', function(apiFactory, $window) {
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

  return authFactory;
}]);
