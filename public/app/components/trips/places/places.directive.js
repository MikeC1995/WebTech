'use strict';

var app = angular.module('app');
app.directive('places', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: {
        places: '=places',
        trip: '&trip'
      },
      controller: 'placesController',
      templateUrl: '/app/components/trips/places/places.view.html',
      link: function($scope, elem, attrs) {
      }
  };
});
