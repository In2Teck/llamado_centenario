$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
  // READY AFTER INTEGRATING THE FB INITS
  $("#invite-friends").on("click", sendRequestViaMultiFriendSelector);
}

function sendRequestViaMultiFriendSelector() {
  FB.ui({method: 'apprequests',
    message: 'Test request',
    filters: ['app_non_users']
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
