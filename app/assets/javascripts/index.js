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
  if ($("#ruby-values").data("app-data") != ""){
    var requestsList = $("#ruby-values").data("app-data").split(',');
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
  FB.api("/", "POST", {
    batch: requestsBatch
  }, function(response){
    if (!response || response.error) {
      alert("Facebook is not responding, please try again later");
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
    contentType: "application/json",
    data: JSON.stringify(referral),
    success: function(){
      //TODO: remove all invitations from facebook
      $("#userTower").hide();
      $("#menu").show();
    },
    error: function() {
      alert("Error accepting referral. It was probably deleted, try accepting another one.");
    } 
  });
}
