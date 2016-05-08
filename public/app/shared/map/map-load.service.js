var app = angular.module('app');
// Lazy loading of Google Map API
app.service('loadGoogleMapAPI', ['$window', '$q', 'mapApiKey', function ( $window, $q, mapApiKey ) {
  var deferred = $q.defer();

  // Load Google map API script
  function loadScript() {
    // Use global document since Angular's $document is weak
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + mapApiKey + '&callback=initMap&libraries=places';
    document.body.appendChild(script);
  }

  // Map script loaded callback
  $window.initMap = function () {
    // Once google maps loaded, add the script tag to the DOM to load the
    // Custom Marker class (which requires 'google')
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.onload = function() {
      deferred.resolve(); // when Custom Marker loaded, resolve
    };
    script.src= '/app/components/map/trip-map/custom-marker.js';
    document.getElementsByTagName('head')[0].appendChild(script);4
  }

  loadScript();

  return deferred.promise;
}]);
