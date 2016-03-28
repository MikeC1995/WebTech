'use strict';

var map = angular.module('map');
map.controller('imageViewerController', ['$scope', function($scope) {
  $scope.nextPhoto = function() {
    $scope.selectedPhotoIndex += 1;
    if($scope.selectedPhotoIndex > $scope.photos.length - 1) {
      $scope.selectedPhotoIndex = 0;
    }
  }
  $scope.prevPhoto = function() {
    $scope.selectedPhotoIndex -= 1;
    if($scope.selectedPhotoIndex < 0) {
      $scope.selectedPhotoIndex = $scope.photos.length - 1;
    }
  }
}]);
