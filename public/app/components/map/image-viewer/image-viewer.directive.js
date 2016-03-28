'use strict';

var app = angular.module('app');
app.directive('imageViewer', function() {
  return {
      restrict: 'E',
      replace: 'false',
      scope: false,
      controller: 'imageViewerController',
      templateUrl: '/app/components/map/image-viewer/image-viewer.view.html',
      link: function($scope, elem, attrs) {
        $scope.closed = true;

        $scope.close = function() {
          $scope.closed = true;
        }

        $scope.selectPhoto = function(index) {
          $scope.closed = false;
          $scope.selectedPhotoIndex = index;
        }
      }
  };
});
