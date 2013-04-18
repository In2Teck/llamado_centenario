$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
  $("#btn-facebook").on("click", login);
  $("#btn-search").on("click", searchTicket);
  $(".btn-close").on("click", goHome);
}

function onFBLoaded() {
  
  $.mobile.changePage($("#search"));
}

function onFBLogin() {
  $.mobile.changePage($("#login"));
}

function goHome() { 
  $.mobile.changePage($("#search"));
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
  $.ajax({url:"/mobile/search_ticket",
    beforeSend: function( xhr ) {
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) xhr.setRequestHeader('X-CSRF-Token', token);
      }, 
    type:"POST", data:{lat: position.coords.latitude, lng: position.coords.longitude}, dataType: "json", success: onSearchTicket});
}

function onPositionError(msg) {
  alert("Tu navegador no es compatible con la geolocalización");
}

var result;
function onSearchTicket(data, textStatus, jqXHR) {
  result = data;
 if (data.won_ticket) {
    $("#txt-result").text("¡ FELICIDADES !");
    $("#txt-info").text("ENCONTRASTE TU BOLETO :)");
    $("#txt-mail").text("Nosotros nos pondremos en contacto contigo vía correo electrónico");
    $("#img-result").attr("src", "assets/mobile/boleto_centenario.png");
     /*var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });*/
  }
  else {
    $("#txt-result").text("¡ LO SENTIMOS ! INTENTA NUEVAMENTE");
    $("#img-result").attr("src", "assets/mobile/tache.png");
    if (!data.error) {
      //alert("No has encontado boleto")
      $("#txt-info").text("NO ESTAS EN EL LUGAR CORRECTO :(");
    }
    else if (data.code == 1) {
      //alert("Por el momento ya no hay boletos. Espera la siguiente pista");
      $("#txt-info").text("YA NO HAY BOLETOS AQUÍ :(");
    }
  }
  $.mobile.changePage($("#result"));
}