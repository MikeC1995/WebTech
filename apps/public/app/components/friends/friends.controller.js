'use strict';

var friends = angular.module('friends', []);
friends.controller('friendsController', ['$scope', 'authFactory', function($scope, authFactory) {
  $scope.friends = [];

  authFactory.getFriends().then(function(friends) {
    $scope.friends = friends;
  }, function() {
    // TODO: handle error
  });

  $scope.profilePicture = authFactory.getProfileUrl;
}]);
