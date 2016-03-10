'use strict';

var app = angular.module('app');
app.directive('gallery', function($timeout) {
  return {
      restrict: 'E',
      replace: 'false',
      scope: {
        placeId: '&'
      },
      controller: 'galleryController',
      templateUrl: '/app/components/trips/gallery/gallery.view.html',
      link: function($scope, elem, attrs) {
      }
  };
});
