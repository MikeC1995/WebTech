'use strict';

var app = angular.module('app');
app.controller('sidePanelController', ['$scope', 'authFactory', function($scope, authFactory) {
  $scope.user = {};
  authFactory.user().then(function(user) {
    $scope.user = user;
  }, function() {
    // TODO: handle error
    console.log("Unable to get user!");
  });
  $scope.profilePicture = authFactory.getProfileUrl;

  $scope.logout = authFactory.logout;
}]);
