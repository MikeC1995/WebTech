'use strict';

var app = angular.module('app');
app.controller('sidePanelController', function($scope, $state) {
  // Need access to $state object on the scope so that
  // menu icon can be hidden using ng-class
  $scope.$state = $state;
});
