$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
  $("#btn-facebook").on("click", login);
  $("#btn-search").on("click", searchTicket);
  $(".btn-close").on("click", goHome);
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
}

function goHome() { 
   if ($("#ruby-values").data("has-ticket")) {
    $("#txt-result").text("¡ FELICIDADES !");
    $("#txt-info").text("YA CUENTAS CON TU BOLETO :)");
    $("#txt-mail").text("Muchas gracias por participar. Nos vemos en el concierto");
    $("#img-result").attr("src", "assets/mobile/boleto_centenario.png");
    $.mobile.changePage($("#result"));
  }
  else {
    $.mobile.changePage($("#search"));
  }
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
    $("#ruby-values").data("has-ticket", true);
    $("#txt-result").text("¡ FELICIDADES !");
    $("#txt-info").text("ENCONTRASTE TU BOLETO :)");
    $("#txt-mail").text("Revisa tu correo electrónico y sigue las instrucciones para recoger tu premio");
    $("#img-result").attr("src", "assets/mobile/boleto_centenario.png");
     /*var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });*/
  }
  else {
    $("#txt-result").text("¡ LO SENTIMOS !");
    $("#img-result").attr("src", "assets/mobile/tache.png");
    if (!data.error) {
      $("#txt-info").text("HAY BOLETOS CERCA DE AQUI, PERO NO ESTAS EN EL LUGAR CORRECTO");
    }
    else if (data.code == 1) {
      $("#txt-info").text("ENCONTRASTE EL LUGAR CORRECTO, PERO YA NO HAY BOLETOS DISPONIBLES");
    }
  }
  $.mobile.loading("hide");
  $.mobile.changePage($("#result"));
}