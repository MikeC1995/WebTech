'use strict';

// Global utility functions (if this gets large, put it in a service)
var Utilities = Utilities || {};

// format and ISO date into dd/mm/yyyy
Utilities.formatDate = function(iso_date) {
  var date = new Date(iso_date);
  return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
}

// The root application module for this app
var app = angular.module('app', ['ui.router', 'map', 'trips', 'friends', 'modals', 'ngContextMenu', 'ngAnimate']);

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
      controller: ['$scope', '$state', 'userFactory', function($scope, $state, userFactory) {
        userFactory.getMe().then(function(me) {
          $state.go('map.user', { user_id: me._id });
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
      },
      // ensure current user is the authenticated user when on manage trips
      resolve: {
        init: function($state, userFactory) {
          userFactory.getMe().then(function(me) {
            $state.params.user_id = me._id;
          });
        }
      }
    })
    .state("friends", {
      url:"/friends",
      views: {
        '': { templateUrl:"/app/components/friends/friends.view.html" }
      },
      // ensure current user is the authenticated user when on manage trips
      resolve: {
        init: function($state, userFactory) {
          userFactory.getMe().then(function(me) {
            $state.params.user_id = me._id;
          });
        }
      }
    });
  $urlRouterProvider.otherwise("/");
});

app.controller('appController', ['$rootScope', '$scope', '$state', 'userFactory', function($rootScope, $scope, $state, userFactory) {

  $rootScope.defaultTripColours = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#f1c40f'];

  $scope.isSidePanelOpen = false;
  $scope.toggleSidePanelOpen = function() {
    $scope.isSidePanelOpen = !$scope.isSidePanelOpen;
  }
  $scope.closeSidePanel = function() {
    $scope.isSidePanelOpen = false;
  }
  $rootScope.$on('$stateChangeSuccess', $scope.closeSidePanel);

  $scope.friend = function(){};
  //$scope.friend = userFactory.getUser;
  $scope.$state = $state;

}]);

app.value('mapApiKey', 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48');
