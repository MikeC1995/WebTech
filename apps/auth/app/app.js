'use strict';

// The root application module for this app
var app = angular.module('authApp', []);

app.controller('authController', ['$rootScope', '$scope', function($rootScope, $scope) {
  console.log("hi!");
}]);
