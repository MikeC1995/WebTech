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
      controller: ['$scope', '$state', 'userFactory', '$window', function($scope, $state, userFactory, $window) {
        userFactory.getMe().then(function(me) {
          $state.go('map.user', { user_id: me._id });
        }, function() {
          // Guest user
          $window.location.href = '/login';
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
        init: function($state, $window, userFactory) {
          userFactory.getMe().then(function(me) {
            $state.params.user_id = me._id;
          }, function() {
            // Guest user
            $window.location.href = '/login';
          });
        }
      }
    })
    .state("friends", {
      url:"/friends",
      views: {
        '': { templateUrl:"/app/components/friends/friends.view.html" }
      },
      // ensure current user is the authenticated user when on friends
      resolve: {
        init: function($state, $window, userFactory) {
          userFactory.getMe().then(function(me) {
            $state.params.user_id = me._id;
          }, function() {
            // Guest user
            $window.location.href = '/login';
          });
        }
      }
    });
  $urlRouterProvider.otherwise("/");
});

app.controller('appController', ['$rootScope', '$scope', '$state', 'userFactory', function($rootScope, $scope, $state, userFactory) {

  $rootScope.defaultTripColours = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#f1c40f',
                                   '#E91E63', '#3F51B5', '#00BCD4', '#009688', '#4CAF50', '#795548', '#607D8B', '#ff5722',
                                   '#b71c1c', '#7B1FA2', '#CDDC39', '#9ccc65', '#FFEB3B', '#BF360C', '#5D4037', '#424242'];

  $scope.isSidePanelOpen = false;
  $scope.toggleSidePanelOpen = function() {
    $scope.isSidePanelOpen = !$scope.isSidePanelOpen;
  }
  $scope.closeSidePanel = function() {
    $scope.isSidePanelOpen = false;
  }
  $rootScope.$on('$stateChangeSuccess', $scope.closeSidePanel);

  function getUser() {
    userFactory.getUser().then(function(user) {
      $scope.user = user;
    });
  }
  $scope.$watch(function() {
    return $state.params.user_id;
  }, function() {
    getUser();
  });
  getUser();

  $scope.$state = $state;

  // hide menu if guest
  $scope.isGuest = userFactory.isGuest;
}]);

app.value('mapApiKey', 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48');
