'use strict';

// A directive for the side panel menu component.
// This directive has the parent's scope!
var app = angular.module('app');
app.directive('sidePanel', function() {
  return {
      restrict: 'E',
      replace: 'true',
      templateUrl: '/app/shared/side-panel/side-panel.view.html',
      link: function(scope, elem, attrs) {
        var menu_icon = elem.find('#menu-icon');
        var menu = elem.find('#menu');

        // Clicking the menu icon toggles whether the panel is open or closed,
        // and updates the icon accordingly.
        menu_icon.bind('click', function() {
          if(menu.hasClass('open')) {
            menu_icon.attr('src', '/assets/images/icons/white/menu.png');
          } else {
            menu_icon.attr('src', '/assets/images/icons/white/back.png');
          }
          menu.toggleClass('open');
          menu.toggleClass('closed');
        });
      }
  };
});
