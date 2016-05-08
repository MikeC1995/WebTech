/* Custom Marker for use on Google Maps.
** Inspired by: http://humaan.com/custom-html-markers-google-maps/
*/

function CustomMarker(latlng, map, args) {
	this.latlng = latlng;
  this.setMap(map);
	this.args = args;
}

CustomMarker.prototype = new google.maps.OverlayView();
CustomMarker.prototype.draw = function() {
	var self = this;
	var div = this.div;
	if (!div) {
		div = this.div = document.createElement('div');

		div.className = 'marker';
    $(div).css({
      'position': 'absolute',
      'cursor': 'pointer',
      'width': this.args.width + "px",
      'height': this.args.height + "px",
      "background-color" : this.args.bg,
      "border-radius" : "50%"
    });

		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}

		google.maps.event.addDomListener(div, "click", function(event) {
			google.maps.event.trigger(self, "click");
		});

		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
	}

	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	if (point) {
		div.style.left = point.x - this.args.width/2 + 'px';
		div.style.top = point.y - this.args.height/2 + 'px';
	}
};

CustomMarker.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
};

CustomMarker.prototype.getPosition = function() {
	return this.latlng;
};

CustomMarker.prototype.setSize = function(width, height) {
  if(this.div) {
    this.args.width = width;
    this.args.height = height;
    $(this.div).css({
      'width': width + "px",
      'height': height + "px"
    });
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
  		this.div.style.left = point.x - width/2 + 'px';
  		this.div.style.top = point.y - height/2 + 'px';
  	}
  }
}

CustomMarker.prototype.listener = function(event, fn) {
  if(this.div) {
    $(this.div).off(event);
    var self = this;
    $(this.div).on(event, function() {
      fn(self);
    });
  }
}

CustomMarker.prototype.trigger = function(event) {
  $(this.div).trigger(event);
}

CustomMarker.prototype.animate = function(animate) {
  if(animate) {
    $(this.div).css({
      'animation': 'pulse-marker .4s infinite alternate',
      'transform-origin': 'center'
    });
  } else {
    $(this.div).css({
      'animation': 'none'
    });
  }
}
