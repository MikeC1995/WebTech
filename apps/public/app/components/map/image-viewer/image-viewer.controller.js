'use strict';

var map = angular.module('map');
map.controller('imageViewerController', ['$scope', '$stateParams', 'userFactory', function($scope, $stateParams, userFactory) {
  // Returns true if the map being viewed is not the authenticated user's
  $scope.me = {};
  userFactory.getMe().then(function(me) {
    $scope.me = me;
  }, function() {});

  $scope.isMyMap = function() {
    return $scope.me._id == $stateParams.user_id;
  }
}]);
