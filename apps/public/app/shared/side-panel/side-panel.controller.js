'use strict';

var app = angular.module('app');
app.controller('sidePanelController', ['$scope', 'authFactory', function($scope, authFactory) {
  $scope.user = authFactory.user;
  $scope.profilePicture = authFactory.getProfileUrl;
}]);
