'use strict';

var app = angular.module('app');
app.directive('gallery', function() {
  return {
      restrict: 'E',
      replace: 'false',
      scope: {},
      //controller: 'galleryController',
      templateUrl: '/app/components/trips/gallery/gallery.view.html',
      link: function(scope, elem, attrs) {
      }
  };
});
