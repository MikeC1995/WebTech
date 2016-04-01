'use strict';

var app = angular.module('app');
app.directive('dropdownMenu', function() {
  return {
      restrict: 'E',
      replace: 'true',
      templateUrl: '/app/shared/dropdown-menu/dropdown-menu.view.html',
      scope: {
        items: '&items',
        callback: '=callback'
      },
      link: function($scope, elem, attrs) {

        function init() {
          if($scope.items().length != 0) {
            $scope.selectedItem = $scope.items()[0];
          }
        }

        $scope.$watch(function() {
          return $scope.items().length;
        }, function() {
          init();
        });

        $scope.select = function(item) {
          $scope.selectedItem = item;
          $scope.callback(item);
        }

        init();
      }
  };
});
