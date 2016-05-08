'use strict';

var app = angular.module('app');
app.directive('placesNavigator', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: false,
      controller: 'placesNavigatorController',
      templateUrl: '/app/components/map/places-navigator/places-navigator.view.html',
      link: function($scope, elem, attrs) {
      }
  };
});
