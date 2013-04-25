var map;
var guess;
var mapZoom;
var timer;
var modalOptions = { onClose: function (dialog) { $.modal.close(); window.location.href = "/"; } };

$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  if ($("#ruby-values").data("has-ticket")) {
    $(".map").css({display: "none"});
    $(".map-found").css({display: "block"});
  }
}

function onFBLoaded() {
  if (!$("#ruby-values").data("has-ticket")) {
    if ($("#ruby-values").data("clue")) {
      if ($("#ruby-values").data("can-guess")) {
        // $("#clue-image").attr("src", $("#ruby-values").data("clue-image"));
        $("#num-tickets").text($("#ruby-values").data("remain-tickets") + " DE " + $("#ruby-values").data("total-tickets"))

        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src  = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDpJbkdk6ozglAO_Fp4bfop3uSg63auvPI&sensor=false&callback=initMap";
        $("head").append(s);

        checkAvailability();
        timer = setInterval(checkAvailability, 15000);
      }
      else {
        modalAlert("Lo sentimos", "Solamente puedes participar una vez por pista. Espera a la siguiente.", modalOptions);
      }
    }
    else {
      modalAlert("Lo sentimos", "Por el momento no hay ninguna pista. Espera a la siguiente.", modalOptions);
    }
  }
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
    google.maps.event.clearListeners(map, 'click');

    var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });

    setTimeout(function(){
    $.ajax({url:"/make_guess", type:"POST", 
      data:{lat: guess.lat(), lng: guess.lng(), clue_id: $("#ruby-values").data("clue-id")}, 
      dataType: "json", success: onPlaceMarker, error: tryAgain });
    }, 2000);
  }
}

function tryAgain(){
  modalAlert("Lo sentimos","Tu intento no se pudo registrar. Por favor vuelve a participar.", modalOptions); 
}

function onPlaceMarker(data, textStatus, jqXHR) {
  if (data.won_ticket) {
    $(".map").css({display: "none"});
    $(".map-found").css({display: "block"});
    publishFound(true);
  }
  else if (!data.error) {
    $(".map").css({display: "none"});
    $("#result").text("PISTA CENTENARIO NO ENCONTRADA");
    $(".map-not-found").css({display: "block"});
    publishFound(false);
    //modalAlert("Lo sentimos", "No has encontrado la pista", modalOptions);
  }
  else if (data.code == 1) {
    $(".map").css({display: "none"});
    $("#result").text("SE TERMINARON LOS BOLETOS");
    $(".map-not-found").css({display: "block"});
    publishFound(false);
    //modalAlert("Lo sentimos", "Ya no hay boletos para esta pista. Espera a la siguiente.", modalOptions);
  }
  else {
    modalAlert("Lo sentimos", "Solamente puedes participar una vez por pista. Espera a la siguiente.", modalOptions);
  }
}

function checkAvailability() {
  $.ajax({url:"/check_availability", type:"GET", dataType: "json", success: onCheckAvailability});
}

function onCheckAvailability(data, textStatus, jqXHR) {
  if (data.result) {
    $("#num-tickets").text(data.clue.remain_tickets + " DE " + $("#ruby-values").data("total-tickets"));
    //var visible_players = 0;//$("#players .player img").length;
    $("#players").empty();
    $.each(data.players, function(index, value) {
      $("#players").append('<div class="player"><img class="player-pic" src="' + value.thumbnail_url +'"/></div>');
    });
  }
  else {
    
    clearInterval(timer);
  }
}

function publishFound(found) {
  var text = '';
  var image = '';
  if (found) {
    text = '¡Ya estoy MÁS CERCA DEL CIELO! e iré a ver a FUN y MARTIN SOLVEIG este 30 de Mayo, ¡tu también participa!';
    image = 'http://boletos.centenario.com/assets/web/ticket_centenario.png';
  }
  else {
    text = '¡Estuve a punto de poder estar MÁS CERCA DEL CIELO con FUN y MARTIN SOLVEIG, tú también tienes oportunidad de hacerlo.';
    image = 'http://boletos.centenario.com/assets/web/75x75.png';
  }
  
  FB.api('/me/feed', 'post', 
    {name: 'MÁS CERCA DEL CIELO', 
    message: text,
    link: 'http://boletos.centenario.com/',
    description: ' ',
    picture: image
  });
}
