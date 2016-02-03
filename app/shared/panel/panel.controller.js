'use strict';

var app = angular.module('app');
app.controller('panelController', function($scope) {
  $scope.test = function() {
    alert("test");
  }
});
