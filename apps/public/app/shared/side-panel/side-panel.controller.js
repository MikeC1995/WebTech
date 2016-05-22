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

  $scope.visibleToItems = [{
    public: false,
    name: "Facebook friends only"
  },{
    public: true,
    name: "Everyone"
  }];

  // set visible item according to user object public setting
  $scope.getVisibleToItems = function() {
    if($scope.me.public) {
      return $scope.visibleToItems[1];
    } else {
      return $scope.visibleToItems[0];
    }
  }

  // change map visibility according to dropdown
  $scope.setVisibleTo = function(item) {
    userFactory.setUserPublic(item.public).then(function() {
      alert("Successfully changed map visibility!");
    }, function () {
      // TODO: pretty error
      alert("Unable to change map visibility!");
    });
  }

}]);
