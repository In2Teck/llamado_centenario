var TAB_PAGE = 'http://www.facebook.com/CentenarioT?v=app_132164533632870';
var modalOptions = { onClose: function (dialog) { $.modal.close(); window.location.href = "/"; } };
var TERMS_PATH;

// EVEN BEFORE the document is ready, so it doesn't load the page.
if (getURLParameter('request_ids') != "null" ) {
  window.top.location.href = TAB_PAGE + "&app_data="+getURLParameter('request_ids');
}

$(document).on("ready", onReady);

function onReady() {
  checkRedirect();
  $(document).on("updateData", onUpdateData);
  $(document).on("fbLoaded", onFBLoaded);
  TERMS_PATH = $("#ruby-values").data("terms-path").replace("/","");
  if ($("#ruby-values").data("is-fan")) {
    $("#section-no-fan").css({display: "none"});
    $("#section-fan").css({display: "block"});
  }
  else {
    $("header").css({margin: 0});
  }
}

function checkRedirect(){
  if ( /android|webos|iphone|ipad|ipod|blackberry|iemobile/i.test(navigator.userAgent.toLowerCase()) ) {
    redirectToMobile();
  } else if (referrerIsFacebookApp()) {
    redirectToServer();
  }
}
   
function redirectToMobile() {
  top.location = 'http://boletos.centenario.com/mobile';
}

function redirectToServer() {
  var querystring = location.search;
  top.location = 'http://www.facebook.com/CentenarioT/app_132164533632870' + querystring;
}
   
function referrerIsFacebookApp() {
  var isInIFrame = (window.location != window.parent.location) ? true : false;
  if (document.URL) {
    if (isInIFrame) {
      return document.URL.indexOf("apps.facebook.com") != -1;
    } else {
      return document.URL.indexOf("centenario.com") != -1;
    }
  }
  return false;
}

function onUpdateData(event, values) {
  $("#ruby-values").append(values);
  var attributes = $("#ruby-values div").prop("attributes");
  $.each(attributes, function() {
    $("#ruby-values").attr(this.name, this.value);
  });
  $(document).trigger('fbLoaded');
}

function onFBLoaded() {
  var signedRequest = $("#ruby-values").data("signed-request").toString();
  var friendCount = $("#ruby-values").data("friend-count").toString();
  if (signedRequest != "") {
    verifyAccount();
  } else if (friendCount < 30) {
    $("#search-clue").removeAttr("class");
    $("#search-clue").attr("style", "cursor: default; opacity: 0.2;");
    $("#invite-friends").removeAttr("class");
    $("#invite-friends").attr("style", "cursor: default; opacity: 0.2;");
  }

  var appData = $("#ruby-values").data("app-data").toString();
  if (appData != ""){
    var requestsList = appData.split(',');
    callRequestsBatch(requestsList);
  }
  
  $(".clickable").on("click", onMenuClick);
}

function verifyAccount() {
  FB.api({
    method: 'fql.query',
    query: 'SELECT friend_count FROM user WHERE uid = ' + $("#ruby-values").data("user-uid")
  }, function(response) {
    if (parseInt(response[0].friend_count) > 30) {
      synchUser(parseInt(response[0].friend_count), $("#ruby-values").data("user-id"));
    } else {
      window.location.href = TERMS_PATH + "/?authorized=false";
    }
  });
}

function synchUser(friend_count, user_id) {
  update_data = {
    friend_count: friend_count
  }
  if ($("#ruby-values").data("is-fan") != undefined) {
    update_data["is_fan"] = $("#ruby-values").data("is-fan");
  }

  $.ajax({
    type: "POST",
    url: "/users/" + user_id + "/synch",
    dataType: "json",
    data: update_data,
    success: function(){
    },
    error: function() {
      modalAlert("Error", "Falla de comunicación con Facebook. Intenta entrar nuevamente a la aplicación.", null);
    } 
  });
  
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
        modalAlert("Error", "Falla de comunicación con Facebook. Intenta entrar nuevamente a la aplicación.",null);
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
      modalAlert("Error", "No puedes aceptar la invitación. Ya estás asignado al equipo de otro amigo",null);
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
  modalDialogue("Selecciona tu invitación", "Sólo puedes participar en la del primer amigo que elijas.", usersHash);
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
      removeRequests($("#ruby-values").data("app-data").toString().split(','));
      $.modal.close();
    },
    error: function() {
      modalAlert("Error", "La invitación que recibiste fue eliminada. Intenta aceptando otra.",null);
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
      modalAlert("Error", "Falla de comunicación con Facebook. Intenta entrar nuevamente a la aplicación.",null);
    } else {
      //Para debuggear
      //console.log(response);
    }
  });
}
