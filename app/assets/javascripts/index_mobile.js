$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
  $("#btn-facebook").on("click", login);
  $("#btn-search").on("click", searchTicket);
  $(".btn-close").on("click", goHome);
}

function onFBLoaded() {
  
  //$.mobile.changePage($("#search"));
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

var diego;
function onPositionSuccess(position) {
  diego = position;
  $.ajax({url:"/mobile/search_ticket", type:"POST", data:{lat: position.coords.latitude, lng: position.coords.longitude}, dataType: "json", success: onSearchTicket});
}

function onPositionError(msg) {
  
}

var result;
function onSearchTicket(data, textStatus, jqXHR) {
  result = data;
  /*if (data.result != null) {
    alert(data.result);
  }
  else if (data.error) {
    alert("");
  }*/
}