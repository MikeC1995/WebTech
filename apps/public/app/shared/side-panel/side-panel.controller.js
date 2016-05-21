'use strict';

var app = angular.module('app');
app.controller('sidePanelController', ['$scope', '$stateParams', 'userFactory', function($scope, $stateParams, userFactory) {

  $scope.getProfilePicture = userFactory.getProfilePicture;
  $scope.logout = userFactory.logout;

  // The user object for the authenticated user
  $scope.me = {};
  userFactory.getMe().then(function(me) {
    $scope.me = me;
  });

  // The user object for the user being viewed
  $scope.friend = {};
  function getFriend() {
    userFactory.getUser().then(function(friend) {
      $scope.friend = friend;
    });
  }
  $scope.$watch(function() {
    return $stateParams.user_id;
  }, function() {
    getFriend();
  });
  getFriend();

  // Returns true if the map being viewed is not the authenticated user's
  $scope.isNotMyMap = function() {
    return $scope.me._id != $stateParams.user_id;
  }
}]);
