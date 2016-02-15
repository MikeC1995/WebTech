'use strict';

var modals = angular.module('modals');
modals.controller('addPhotosController', ['$scope', 'tripsFactory', 'Upload', function($scope, tripsFactory, Upload) {
  $scope.uploadFiles = function (files) {
    $scope.files = files;
    if (files && files.length) {
      console.log("upload " + files.length + " files.");
      Upload.upload({
        url: '/api/photos',
        data: {
          photos: files
        }
      }).then(function (response) {
        //$timeout(function () {
          console.log("RESULT1: " + JSON.stringify(response.data));
        //});
      }, function (response) {
        console.log("RESULT2: " + response.status + "," + response.data);
      }, function (evt) {
        console.log("progress...");
      });
    }
  }
}]);
