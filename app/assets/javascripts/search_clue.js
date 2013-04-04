var map;
var guess;
var mapZoom;

$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
 // $("#clue-image").attr("src", $("#ruby-values").data("clue-image"));
  $("#num-tickets").text($("#ruby-values").data("remain-tickets") + " de " + $("#ruby-values").data("total-tickets"))
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

function onClick(event) {
  guess = event.latLng;
  mapZoom = map.getZoom();
  setTimeout("placeMarker()", 600);
}

function placeMarker() {
  if (mapZoom == map.getZoom()) {
    var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });

    $.ajax({url:"/make_guess", type:"POST", data:{lat: guess.lat(), lng: guess.lng()}, dataType: "json", success: onPlaceMarker});
  }
}
var result;
function onPlaceMarker(data, textStatus, jqXHR) {
  result = data.result;
  alert(result);
}

function testMarker() { alert("added");}