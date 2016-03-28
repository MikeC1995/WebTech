'use strict';

// A directive for the side panel menu component.
// This directive has the parent's scope!
var app = angular.module('app');
app.directive('sidePanel', function() {
  return {
      restrict: 'E',
      replace: 'true',
      templateUrl: '/app/shared/side-panel/side-panel.view.html',
      link: function(scope, elem, attrs) {
      }
  };
});
