$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
  $(document).on("fbLogin", onFBLogin);
}

function onFBLoaded() {
  $("#login").css({visibility: "hidden"});
  alert("chido");
}

function onFBLogin() {
  $("#login").css({visibility: "visible"});
}