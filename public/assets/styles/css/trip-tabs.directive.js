'use strict';

var trips = angular.module('trips');
trips.directive('tripTabs', function() {
  return {
      restrict: 'E',
      replace: 'true',
      templateUrl: '/app/components/trips/trip-tabs/trip-tabs.view.html',
      controller: 'tripTabsController',
      scope: {
        selected: '=selected'
      },
      link: function(scope, elem, attrs) {
      }
  };
});
