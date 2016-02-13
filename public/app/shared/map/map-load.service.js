var app = angular.module('app');
// Lazy loading of Google Map API
app.service('loadGoogleMapAPI', ['$window', '$q', 'mapApiKey', function ( $window, $q, mapApiKey ) {
  var deferred = $q.defer();

  // Load Google map API script
  function loadScript() {
    // Use global document since Angular's $document is weak
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + mapApiKey + '&libraries=places&callback=initMap';
    document.body.appendChild(script);
  }

  // Script loaded callback, send resolve
  $window.initMap = function () {
    deferred.resolve();
  }

  loadScript();

  return deferred.promise;
}]);
