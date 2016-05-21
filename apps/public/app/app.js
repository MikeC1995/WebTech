'use strict';

// Global utility functions (if this gets large, put it in a service)
var Utilities = Utilities || {};

// format and ISO date into dd/mm/yyyy
Utilities.formatDate = function(iso_date) {
  var date = new Date(iso_date);
  return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}

// The root application module for this app
var app = angular.module('app', ['ui.router', 'map', 'trips', 'modals', 'ngContextMenu', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {

  // Angular misbehaves when the URL contains a "#_=_" hash,
  // which is appended by the Facebook auth callback.
  $urlRouterProvider.rule(function ($injector, $location) {
    if ($location.hash() === '_=_' || $location.url() === '/_=_') {
      $location.hash(null);
      $location.url('/');
    }
  });

  // Set up routes
  $stateProvider
    .state("default", {
      url:"/",
      controller: ['$scope', '$state', 'authFactory', function($scope, $state, authFactory) {
        authFactory.me().then(function(user) {
          $state.go('map.user', { user_id: user._id });
        }, function() {
          // TODO: redirect to public maps page
          console.log("No user");
        });
      }]
    })
    .state("map", {
      abstract: true,
      url:"/map",
      views: {
        '': { templateUrl:"/app/components/map/map.view.html" }
      }
    })
    .state("map.user", {
      url:"/:user_id"
    })
    .state("trips", {
      url:"/trips",
      views: {
        '': { templateUrl:"/app/components/trips/trips.view.html" }
      }
    })
    .state("friends", {
      url:"/friends",
      views: {
        '': { templateUrl:"/app/components/friends/friends.view.html" }
      }
    });
  $urlRouterProvider.otherwise("/");
});

app.controller('appController', ['$rootScope', '$scope', 'authFactory', '$stateParams', function($rootScope, $scope, authFactory, $stateParams) {
  $scope.isSidePanelOpen = false;

  $scope.toggleSidePanelOpen = function() {
    $scope.isSidePanelOpen = !$scope.isSidePanelOpen;
  }
  $scope.closeSidePanel = function() {
    $scope.isSidePanelOpen = false;
  }
  $rootScope.$on('$stateChangeSuccess', $scope.closeSidePanel);

  $rootScope.defaultTripColours = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#f1c40f'];

  $scope.friend = {};
  function getUser() {
    authFactory.user().then(function(friend) {
      $scope.friend = friend;
    }, function() {
      // TODO: handle error
      console.log("Unable to get user!");
    });
  }

  $scope.$watch(function() {
    return $stateParams.user_id;
  }, function(user_id) {
    getUser();
  });

}]);

app.value('mapApiKey', 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48');
