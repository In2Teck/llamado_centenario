var map;
$(document).on("ready", onReady);

function onReady() {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src  = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDpJbkdk6ozglAO_Fp4bfop3uSg63auvPI&sensor=false&callback=initMap";
  $("head").append(s); 
}

function initMap()
{
  var mapOptions = {
    center: new google.maps.LatLng(19.433333, -99.133333),
    minZoom: 13,
    zoom: 13,
    maxZoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#map-canvas")[0], mapOptions);
  google.maps.event.addListener(map, 'click', onClick);
}

var diego;
function onClick(event) {
  diego = event.latLng;
  /*var marker = new google.maps.Marker({
      position: diego,
      map: map
    });*/

} 