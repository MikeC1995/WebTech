'use strict';

var friends = angular.module('friends', []);
friends.controller('friendsController', ['$scope', 'userFactory', function($scope, userFactory) {
  $scope.friends = [];

  userFactory.getFriends().then(function(friends) {
    $scope.friends = friends;
  }, function() {
    // TODO: handle error
  });

  $scope.profilePicture = userFactory.getProfileUrl;
}]);
