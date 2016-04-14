'use strict';

// The root application module for this app
var app = angular.module('landing');
app.directive('animatedMap', function() {
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: '/app/animated-map/animated-map.view.html',
    link: function($scope, elem, attrs) {
      // Create canvas & context
      var canvasContainer = document.getElementById('animated-map');
      var canvas = document.getElementById('map-canvas');
      var context = canvas.getContext('2d');
      var iconRadius, points;
      var t = 1;
      var resolution = 50;

      initialize();
			function initialize() {
				window.addEventListener('resize', redraw, false);
			}

      // Capture scroll events
      $(window).scroll(function() {
        checkAnimations();
      });

      function isInViewport() {
        var rect = elem[0].getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
          rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
      }

      // If animation not yet happened, invoke it and then add 'drawn' class
      // to canvasContainer to prevent re-animating
      function checkAnimations() {
        if($(canvasContainer).hasClass('drawn')) return;
        if(isInViewport()) {
          redraw();
          $(canvasContainer).addClass('drawn');
        }
      }

      // redraw the canvas with updated dimensions
			function redraw() {
				canvas.width = $(canvasContainer).width();
				canvas.height = $(canvasContainer).height();
        iconRadius = (0.1 * canvas.width)/2;
        t = 1;
				drawLines();
			}

      // convert points written in percentages to actual canvas coordinates
      function percentagesToPoints(vertices) {
        var newVertices = [];
        for(var i = 0; i < vertices.length; i++){
          newVertices.push({
            x: vertices[i].x * canvas.width + iconRadius,
            y: vertices[i].y * canvas.height + iconRadius,
            id: vertices[i].id
          });
        }
        return newVertices;
      }

      // subdivide vertices of line segments into small chunks in order to animate line drawing
      function animatablePoints(vertices) {
        var waypoints = [];
        for(var i = 1; i < vertices.length; i++){
          var pt0 = vertices[i-1];
          var pt1 = vertices[i];
          var dx = pt1.x - pt0.x;
          var dy = pt1.y - pt0.y;
          for(var j = 0; j < resolution; j++) {
            var x = pt0.x + dx * j / resolution;
            var y = pt0.y + dy * j / resolution;
            if(j == resolution-1) {
              waypoints.push({ x: x, y: y, id: pt1.id });
            } else {
              waypoints.push({ x: x, y: y });
            }
          }
        }
        return waypoints;
      }

      // incrementally draw additional line segments along the path
      function animate() {
        if(t < points.length - 1) {
          requestAnimationFrame(animate);
        }

        context.beginPath();
        context.moveTo(points[t-1].x,points[t-1].y);
        context.lineTo(points[t].x,points[t].y);
        context.stroke();
        // id property is appended to points[t] if this is the last line segment of the animation
        if(points[t].id) {
          // add draw class to the image element so that it animates into view
          var elem = $('#' + points[t].id);
          elem.addClass('draw');
        }
        t++;
      }

      // draw the lines connecting the points on the canvas, animating them
      // if not yet drawn before.
      function drawLines() {
        // line segment vertices in percentages (corresponding to img
        // top and left offsets)
        points = [{
          x: 0.20, y: 0.35, id: 'london'
        },{
          x: 0.27, y: 0.5, id: 'paris'
        },{
          x: 0.45, y: 0.4, id: 'berlin'
        },{
          x: 0.6, y: 0.55, id: 'budapest'
        },{
          x: 0.55, y: 0.7, id: 'croatia'
        }];
        points = percentagesToPoints(points);
        if(!$(canvasContainer).hasClass('drawn')) {
          points = animatablePoints(points);
        }
        context.lineWidth = 10;
        context.strokeStyle = '#d12e2e';
        animate();
      }
    }
  }
});
