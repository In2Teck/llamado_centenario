$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
  // READY AFTER INTEGRATING THE FB INITS
  $("#invite_friends").on("click", sendRequestViaMultiFriendSelector);
}

function sendRequestViaMultiFriendSelector() {
  FB.ui({method: 'apprequests',
    message: 'Test request',
    filters: ['app_non_users']
  }, requestCallback);
}

function requestCallback(response) {
  // Handle callback here
  alert(response.toString());
}
