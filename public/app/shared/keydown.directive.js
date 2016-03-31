'use strict';

var app = angular.module('app');
app.directive('keydown', function () {
  return {
    restrict: 'A',
    scope: {
      keydown: '&'
    },
    link: function ($scope, element, attrs) {
      $scope.keydown = $scope.keydown();

      element.bind("keydown", function (event) {
        $scope.$apply(function () {
          $scope.keydown(event.which);
        });
        event.preventDefault();
      });
    }
  }
});
