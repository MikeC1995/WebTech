'use strict';

var app = angular.module('app');
app.controller('sidePanelController', function($scope, $state) {
  $scope.$state = $state;
  $scope.test = function() {
    console.log("test " + JSON.stringify($scope.$state.current));
  }
});
