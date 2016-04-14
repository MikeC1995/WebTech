'use strict';

// The root application module for this app
var app = angular.module('landing', []);
app.controller('appController', ['$rootScope', '$scope', function($rootScope, $scope) {
  // Smooth scrolling
  $(document).ready(function() {
    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      var target = this.hash;
      $('html, body').stop().animate({
        'scrollTop':  $(target).offset().top - 80
      }, 900, 'swing', function () {
        window.location.hash = target;
      });
    });
  });

  $scope.toggleNav = function() {
    $('nav ul').toggleClass('open');
  }
}]);
