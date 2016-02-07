'use strict';

var app = angular.module('app');
app.directive('places', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: {},
      templateUrl: '/app/components/trips/places/places.view.html',
      link: function(scope, elem, attrs) {
        scope.places = ["Paris, France", "Berlin, Germany", "Amsterdam, Netherlands", "Prague, Czech Republic"];
        scope.selected = 0;
        scope.isSelected = function(index) {
          return index == scope.selected;
        }
      }
  };
});
