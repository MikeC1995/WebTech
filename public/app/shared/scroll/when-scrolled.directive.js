'use strict';

var app = angular.module('app');

// Directive to attach behaviour to object when scrolled to bottom
app.directive('whenScrolled', function() {
  return function(scope, elem, attr) {
    var raw = elem[0];
    elem.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
});
