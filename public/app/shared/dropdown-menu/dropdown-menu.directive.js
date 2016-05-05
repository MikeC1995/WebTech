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
      require: 'ngModel',
      link: function($scope, elem, attrs, model) {

        // initialise to select the first item in the list, and update model
        function init() {
          if($scope.items().length != 0) {
            $scope.selectedItem = $scope.items()[0];
            model.$setViewValue($scope.selectedItem);
          }
        }

        // reset if the number of items in the list changes
        $scope.$watch(function() {
          return $scope.items().length;
        }, function() {
          init();
        });

        // update the model when an item is selected
        $scope.select = function(item) {
          $scope.selectedItem = item;
          model.$setViewValue($scope.selectedItem);
        }

        // update the selected dropdown item when the model changes externally
        // (e.g. by a click on a map node)
        model.$render = function() {
          $scope.select(model.$modelValue);
        };

        init();
      }
  };
});
