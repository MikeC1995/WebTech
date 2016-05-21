'use strict';

var app = angular.module('app');

app.factory('authFactory', ['apiFactory', '$window', function(apiFactory, $window) {
  var authFactory = {};

  var user;
  apiFactory.getUser().then(function(_user) {
    user = _user.data.data;
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
  authFactory.user = function() {
    return new Promise(function(resolve, reject) {
      if(user) {
        resolve(user);
      } else {
        apiFactory.getUser().then(function(_user) {
          user = _user.data.data;
          resolve(user);
        }, function() {
          reject();
        });
      }
    });
  }
  authFactory.getProfileUrl = function() {
    if(user) {
      return "https://graph.facebook.com/v2.6/" + user.facebookID + "/picture" + "?width=200&height=200" + "&access_token=" + user.accessToken;
    }
    return "";
  }

  return authFactory;
}]);
