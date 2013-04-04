var TAB_PAGE = 'http://www.facebook.com/In2Teck?v=app_132164533632870';

// EVEN BEFORE the document is ready, so it doesn't load the page.
if (getURLParameter('request_ids') != "null" ){
  window.top.location.href = TAB_PAGE + "&app_data="+getURLParameter('request_ids');
}

$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
  var appData = $("#ruby-values").data("app-data").toString();
  if (appData != ""){
    var requestsList = appData.split(',');
    callRequestsBatch(requestsList);
  }
  $("#menu div").on("click", onMenuClick);
}

function callRequestsBatch(requestsList){
  var requestsBatch = [];
  $.each(requestsList, function(){
    requestsBatch.push({
      "method": "GET",
      "relative_url": this.toString()
    });
  });
  
  var assignedToTower = eval($("#ruby-values").data("assigned-to-tower"));
  if (!assignedToTower && requestsBatch.length > 0) {
    FB.api("/", "POST", {
      batch: requestsBatch
    }, function(response){
      if (!response || response.error) {
        alert("Error de comunicación con Facebook, intenta nuevamente en unos minutos.");
      } else {
        var usersHash = {};
        $.each(response, function(){
          responseBody = JSON.parse(this.body);
          userName = responseBody.from.name.split(" ");
          usersHash[responseBody.from.id] = userName[0] + " " + userName[userName.length - 1];
        });
        selectUsersTower(usersHash);
      }
    });
  } else if (assignedToTower) {
    if (requestsList.length > 0) {
      alert("No has podido aceptar la invitación. Ya fuiste asignado a la torre de otro amigo.");
    }
    if (requestsBatch.length > 0) {
      removeRequests(requestsList);
    }
  }
}

function onMenuClick(event) {
  var url = $(event.currentTarget).data("path");
  window.location.href = url;
}

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}

function selectUsersTower(usersHash) {
  $("#userTower").show();
  $("#menu").hide();
  $.each(usersHash, function(value, key){
    // ADDING USER REQUESTS
    $("#userTower").append("<div id='"+value+"'>"+key+"</div>");
    $("#"+value).append("<button class='acceptRequestButton' onclick='acceptRequest("+value+")'>SELECT</button>");
  });
}

function acceptRequest(userUID){

  referral = {
    origin_user_uid: userUID.toString(),
    referred_user_id: $("#ruby-values").data("user-id")
  };

  $.ajax({
    type: "POST",
    url: "/referrals/accept",
    dataType: "json",
    data: referral,
    success: function(){
      removeRequests($("#ruby-values").data("app-data").split(','));

      $("#userTower").hide();
      $("#menu").show();
    },
    error: function() {
      alert("Error aceptando la invitación. Probablemente fue eliminada, intenta aceptando otra.");
    } 
  });
}

function removeRequests(requestsList){
  var requestsBatch = [];
  $.each(requestsList, function(){
    requestsBatch.push({
      "method": "DELETE",
      "relative_url": this.toString()
    });
  });
  FB.api("/", "POST", {
    batch: requestsBatch
  }, function(response) {
    if (!response || response.error) {
      alert("Error de comunicación con Facebook, intenta nuevamente en unos minutos.");
    } else {
      //Para debuggear
      //console.log(response);
    }
  });
}
