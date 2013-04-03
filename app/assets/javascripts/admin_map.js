var map;
$(document).on("ready", onReady);

function onReady() {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src  = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDpJbkdk6ozglAO_Fp4bfop3uSg63auvPI&sensor=false&callback=initMap";
  $("head").append(s);
}

function initMap() {
  var dLongitude = $("#clue_longitude")[0].value;
  var dLatitude = $("#clue_latitude")[0].value;
  var mapDiv = $("#map-canvas")[0];
  var map = new google.maps.Map(mapDiv, {
              center: new google.maps.LatLng(dLatitude, dLongitude),
              minZoom: 11,
              zoom: 15,
              maxZoom: 17,
              mapTypeId: google.maps.MapTypeId.ROADMAP              
  });
  DistanceWidget.prototype = new google.maps.MVCObject();
  RadiusWidget.prototype = new google.maps.MVCObject();

  RadiusWidget.prototype.distance_changed = function() {
    this.set('radius', this.get('distance') * 1000);
  };

  RadiusWidget.prototype.addSizer_ = function() {
    var sizer = new google.maps.Marker({
      draggable: true,
      title: 'Expande el radio'
    });
    sizer.bindTo('map', this);
    sizer.bindTo('position', this, 'sizer_position');
    
    var me = this;
    google.maps.event.addListener(sizer, 'drag', function() {
      me.setDistance();
    });
  };

  RadiusWidget.prototype.center_changed = function() {
    var bounds = this.get('bounds');

    if (bounds) {
      var lng = bounds.getNorthEast().lng();

      var position = new google.maps.LatLng(this.get('center').lat(), lng);
      this.set('sizer_position', position);
    }
  };

  RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
    if (!p1 || !p2) {
      return 0;
    }
    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  RadiusWidget.prototype.setDistance = function() {
    var pos = this.get('sizer_position');
    var center = this.get('center');
    var distance = this.distanceBetweenPoints_(center, pos);

    if (this.get('maxDistance') && distance > this.get('maxDistance')) {
      distance = this.get('maxDistance');
    }

    if (this.get('minDistance') && distance < this.get('minDistance')) {
      distance = this.get('minDistance');
    }

    this.set('distance', distance);
  
    var newPos = this.getSnappedPosition(pos);
    this.set('sizer_position', newPos);
  }; 

  RadiusWidget.prototype.getSnappedPosition = function(pos) {
    var bounds = this.get('bounds');
    var center = this.get('center');
    var left = new google.maps.LatLng(center.lat(), bounds.getSouthWest().lng()); 
    var right = new google.maps.LatLng(center.lat(), bounds.getNorthEast().lng());

    var leftDist = this.distanceBetweenPoints_(pos, left);
    var rightDist = this.distanceBetweenPoints_(pos, right);

    if (leftDist < rightDist) {
      return left;
    } else {
      return right;
    }
  };

  var distanceWidget = new DistanceWidget(map);

  google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
    displayInfo(distanceWidget);
  });

  google.maps.event.addListener(distanceWidget, 'position_changed', function() {
    displayInfo(distanceWidget);
  });
}

function displayInfo(widget) {
  $("#clue_radius")[0].value = widget.get('distance');
  $("#clue_latitude")[0].value = widget.get('position').lat();
  $("#clue_longitude")[0].value = widget.get('position').lng();
}

function DistanceWidget(map) {
  this.set('map', map);
  this.set('position', map.getCenter());

  var marker = new google.maps.Marker({
    draggable: true,
    title: 'Mueve el centro'
  });

  this.set('minDistance', 0.05);
  this.set('maxDistance', 0.2);

  marker.bindTo('map', this);

  marker.bindTo('position', this);

  var radiusWidget = new RadiusWidget();

  radiusWidget.bindTo('map', this);

  radiusWidget.bindTo('center', this, 'position'); 

  radiusWidget.bindTo('maxDistance', this);
  radiusWidget.bindTo('minDistance', this);

  this.bindTo('distance', radiusWidget);

  this.bindTo('bounds', radiusWidget);
}

function RadiusWidget() {
  var circle = new google.maps.Circle({
    strokeWeight: 2
  });
  
  var dRadius = $("#clue_radius")[0].value;

  this.set('distance', dRadius);

  this.bindTo('bounds', circle);

  circle.bindTo('center', this);

  circle.bindTo('map', this);

  circle.bindTo('radius', this);

  this.addSizer_(); 
}
