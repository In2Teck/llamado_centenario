$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
  $("#menu div").on("click", onMenuClick);
}

function onMenuClick(event) {
  var url = $(event.currentTarget).data("path");
  window.location.href = url;
}