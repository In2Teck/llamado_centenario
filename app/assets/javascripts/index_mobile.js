$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
  $("#btn-facebook").on("click", login);
}

function onFBLoaded() {
  
  //$.mobile.changePage($("#search"));
}

function onFBLogin() {
  $.mobile.changePage($("#login"));
}