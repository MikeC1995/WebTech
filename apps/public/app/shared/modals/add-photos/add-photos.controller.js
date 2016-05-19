'use strict';

var modals = angular.module('modals');
modals.controller('addPhotosController', ['$rootScope', '$scope', 'Upload', '$state', function($rootScope, $scope, Upload, $state) {
  $scope.placeName = $scope.$parent.selected.getPlace().location.name;
  $scope.tripName = $scope.$parent.selected.getTrip().name;
  $scope.files = [];
  $scope.progress = 0;
  $scope.uploading = false; // indicates images uploading
  $scope.uploadObj = {};
  $scope.processing = false;  // indicates server processing the images

  $scope.setSelectedFiles = function (files) {
    $scope.files = files;
  }

  // Upload the selected files tagged by trip and place ids
  $scope.uploadFiles = function () {
    if ($scope.files && $scope.files.length) {
      $scope.uploading = true;
      $scope.uploadObj = Upload.upload({
        url: '/api/photos',
        data: {
          place_id: $scope.$parent.selected.getPlace()._id,
          photos: $scope.files
        }
      });
      $scope.uploadObj.then(success, error, progress);
    }
  }

  $scope.cancel = function() {
    if($scope.uploading) $scope.uploadObj.abort();
  }

  function success(response) {
    $rootScope.$broadcast('uploaded-photos', { place: $scope.$parent.selected.getPlace(), number: $scope.files.length });
    $scope.uploading = false;
    $scope.processing = false;
    $scope.files = [];
    $state.go('trips');
    alert("Successfully uploaded photos!");
  }

  function error(response) {
    $scope.uploading = false;
    $scope.processing = false;
    $scope.files = [];
    // TODO this is called when cancelled too.
    // TODO pretty error
    alert("Error uploading photos!");
  }

  function progress(evt) {
    $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    if(Math.round($scope.progress) == 100) {
      $scope.uploading = false;
      $scope.processing = true;
    }
  }
}]);
