'use strict';

var app = angular.module('app');
app.controller('sidePanelController', ['$scope', '$stateParams', 'authFactory', function($scope, $stateParams, authFactory) {
  $scope.me = {};
  authFactory.me().then(function(me) {
    $scope.me = me;
  }, function() {
    // TODO: handle error
    console.log("Unable to get user!");
  });
  $scope.profilePicture = authFactory.getProfileUrl;

  $scope.logout = authFactory.logout;
  $scope.$stateParams = $stateParams;

  $scope.friend = {};
  function getUser() {
    authFactory.user($stateParams.user_id).then(function(friend) {
      $scope.friend = friend;
    }, function() {
      // TODO: handle error
      console.log("Unable to get user!");
    });
  }

  $scope.$watch(function() {
    return $stateParams.user_id;
  }, function(user_id) {
    getUser();
    console.log("updated friend");
    console.log($scope.friend);
  });

}]);
