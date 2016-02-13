'use strict';

// The trips module
var trips = angular.module('trips', ['ui.router', 'api']);

trips.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    // abstract sub-state of trips forms the dialog backdrop + holder
    .state("trips.modal", {
      views: {
        'modal': { templateUrl:"/app/shared/modals/modal.view.html" }
      },
      abstract: true
    })
    // add place dialog
    .state("trips.modal.addPlace", {
      url: '/addplace',
      views: {
        'modal': { templateUrl:"/app/shared/modals/add-place/add-place.view.html" }
      }
    });
});
