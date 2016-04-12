'use strict';

// The root application module for this app
var app = angular.module('landing', ['ui.router', 'ngAnimate']);
app.controller('appController', ['$rootScope', '$scope', function($rootScope, $scope) {
    console.log("hello!");
}]);
