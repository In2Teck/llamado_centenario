$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
  $("#btn-facebook").on("click", login);
  $("#btn-search").on("click", searchTicket);
  $("#btn-regresar").on("click", goHome);
}

function onFBLoaded() {
  FB.Event.subscribe('edge.create', onLike);
  FB.api({
    method: 'fql.query',
    query: 'SELECT uid FROM page_fan WHERE uid = me() AND page_id = 360288077398668'
  }, function(response) {
      if (response.length > 0) {
        goHome();      
      }
      else {
        $.mobile.changePage($("#like"));
      }
  });
}

function onFBLogin() {
  $.mobile.changePage($("#login"));
}

function onLike(response) {
  goHome();
  $.ajax({url:"/mobile/new_fan",
    beforeSend: function( xhr ) {
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) xhr.setRequestHeader('X-CSRF-Token', token);
      }, 
    type:"POST", success: function(){} });
}
var diego;
function goHome() { 
  /*if ($("#ruby-values").data("has-ticket")) {
    $.mobile.changePage($("#won"));
  }
  else {
    $.mobile.changePage($("#search"));
  }*/
  $.ajax({
    type: "GET",
    dataType: "text/html",
    url: "http://www.centenario.com/api/user/" + $("#ruby-values").data("fbid"),
    success: function(data, textStatus, jqXHR) {
      diego = data;
      console.log(data);
      console.log(textStatus);
    },
    error: function() {
      diego = "error";
    } 
  });
}

function searchTicket()
{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);
  } else {
    onPositionError('not supported');
  }
}

function onPositionSuccess(position) {
  $.mobile.loading( "show", {text: "Localizando...", textVisible: true, theme: "a"});
  $.ajax({url:"/mobile/search_ticket",
    beforeSend: function( xhr ) {
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) xhr.setRequestHeader('X-CSRF-Token', token);
      }, 
    type:"POST", data:{lat: position.coords.latitude, lng: position.coords.longitude}, dataType: "json", success: onSearchTicket});
}

function onPositionError(msg) {
  alert("Tu navegador no es compatible o necesitas habilitar la opción de localización en tu teléfono");
}

var result;
function onSearchTicket(data, textStatus, jqXHR) {
  result = data;
  if (data.won_ticket) {
    
  }
  else {
  }
  $.mobile.loading("hide");
  $.mobile.changePage($("#result"));
}

function publishFound(found) {
  /*var text = '';
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
    {name: 'EL LLAMADO CENTENARIO', 
    message: text,
    link: 'http://centenario.com/',
    description: ' ',
    picture: image
  });*/
}
