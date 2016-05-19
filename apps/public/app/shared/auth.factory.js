'use strict';

var app = angular.module('app');

app.factory('authFactory', ['apiFactory', function(apiFactory) {
  var authFactory = {};

  var user;
  apiFactory.getUser().then(function(_user) {
    user = _user.data.data;
  }, function() {
    console.log("Error getting user!");
  });

  authFactory.logout = function() {
    console.log("logout");
  }
  authFactory.user = function() {
    return user;
  }
  authFactory.getProfileUrl = function() {
    if(user) {
      return "https://graph.facebook.com/v2.6/" + user.facebookID + "/picture" + "?width=200&height=200" + "&access_token=" + user.accessToken;
    }
    return "";
  }

  return authFactory;
}]);
