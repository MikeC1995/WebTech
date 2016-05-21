'use strict';

var friends = angular.module('friends', []);
friends.controller('friendsController', ['$scope', 'userFactory', function($scope, userFactory) {
  $scope.friends = [];

  userFactory.getMe().then(function() {
    userFactory.getFriends().then(function(friends) {
      $scope.friends = friends;
    }, function() {
      // TODO: handle error
      console.log("Unable to fetch friend list.");
    });
  });

  $scope.getProfilePicture = userFactory.getProfilePicture;
}]);
