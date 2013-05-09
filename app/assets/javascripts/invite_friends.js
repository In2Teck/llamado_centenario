$(document).on("ready", onReady);

function onReady() {
  $("#amigos").mCustomScrollbar();
  $(document).on("fbLoaded", onFBLoaded);
  if ($("#ruby-values").data("has-ticket")) {
    $(".invite").css({display: "none"});
    $(".has-ticket").css({display: "block"});
    $("#folio").append("<p style='font-size:0.5em;'> Tu folio es " + $("#ruby-values").data("folio") + "</p>");
  }
}

function onFBLoaded() {
  // READY AFTER INTEGRATING THE FB INITS
  if (!$("#ruby-values").data("has-ticket")) {
    $("#invite-friends").on("click", sendRequestViaMultiFriendSelector);
  }
}

function sendRequestViaMultiFriendSelector() {
  var ids = []
  if ($("#ruby-values").data("users")) {
    $.each($("#ruby-values").data("users"), function(index, value) {
        ids.push(value.referred_uid);
    });
  }
  FB.ui({method: 'apprequests',
    message: 'Acepta esta invitación y apoya a tu amigo a estar MÁS CERCA DEL CIELO con Tequila Centenario.',
    exclude_ids: ids
  }, createInvitesInBackend);
}

function createInvitesInBackend(response) {
  var referrals = [];
  $.each(response.to, function(){
    referrals.push({
      user_id: $("#ruby-values").data("user-id"),
      accepted: false,
      referred_uid: this.toString()
    });
  });
  
  $.ajax({
    type: "POST",
    url: "/referrals/create_batch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({referrals: referrals}),
    error: function() {
      modalAlert("Error", "No se pudieron crear los referidos. Por favor intenta más tarde.", null);
    } 
  });
}
