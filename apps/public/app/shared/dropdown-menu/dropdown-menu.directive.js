'use strict';

var app = angular.module('app');
app.directive('dropdownMenu', function() {
  return {
      restrict: 'E',
      replace: 'true',
      templateUrl: '/app/shared/dropdown-menu/dropdown-menu.view.html',
      scope: {
        items: '&items',
        set: '=set',
        get: '=get'
      },
      link: function($scope, elem, attrs) {

        // initialise to select the first item in the list, and update model
        function init() {
          if($scope.items().length != 0) {
            $scope.selectedItem = $scope.items()[0];
            $scope.set($scope.selectedItem);
          }
        }

        // reset if the number of items in the list changes
        $scope.$watch(function() {
          return $scope.items().length;
        }, function() {
          init();
        });

        // update when an item is selected
        $scope.select = function(item) {
          $scope.selectedItem = item;
          $scope.set($scope.selectedItem);
        }

        // update when selected item changes externally
        $scope.$watch($scope.get,
        function (value) {
          $scope.selectedItem = value;
        }, true);

        init();
      }
  };
});
