$(document).on("ready", onReady);

function onReady() {
  loadFB();
}

function loadFB() {
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '132164533632870', // App ID from the App Dashboard
      channelUrl : 'http://boletos.centenario.com/channel.html', // Channel File for x-domain communication
      status     : true, // check the login status upon init?
      cookie     : true, // set sessions cookies to allow your server to access the session?
      xfbml      : true  // parse XFBML tags on this page?
    });

    FB.Event.subscribe('auth.statusChange', handleStatusChange);

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        if ($('#ruby-session').data("session")) {
          $(document).trigger('fbLoaded');
        }
        else {
          $(document).trigger('fbLogin');  
          window.location.href = '/users/auth/facebook';
        }
      } else if (response.status === 'not_authorized') {
        $(document).trigger('fbLogin');
      } else {
        $(document).trigger('fbLogin');
      }
     });
    };

  // Load the SDK's source Asynchronously
  // Note that the debug version is being actively developed and might 
  // contain some type checks that are overly strict. 
  // Please report such bugs using the bugs tool.
  (function(d, debug){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/es_LA/all" + (debug ? "/debug" : "") + ".js";
     ref.parentNode.insertBefore(js, ref);
   }(document, /*debug*/ false));
}

function login() {

  //BUG#5329429825671 Changed to permission URL instead of FB.login
  var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=" + 132164533632870 + "&response_type=code&redirect_uri=" + "http://boletos.centenario.com/mobile" + "&scope=" + "email,user_likes,publish_actions";
  window.location = permissionUrl;

  /*FB.login(function(response) {
    if (response.authResponse) {
    /*  FB.api('/me/feed', 'post', 
        {name: 'MÁS CERCA DEL CIELO', 
        message: 'Mi camino para estar MÁS CERCA DEL CIELO ha comenzado y puedo ser 1 de los asistentes al concierto de FUN y MARTIN SOLVEIG',
        link: 'http://boletos.centenario.com/',
        description: ' ',
        picture: 'http://boletos.centenario.com/assets/web/75x75.png'
      });
    
      window.location.href = '/users/auth/facebook/';
    } else {
    }
  }, {scope: 'email,user_likes,publish_actions'});*/
}

function handleStatusChange(response) {
  /*if (response.authResponse) {
    FB.Event.unsubscribe('auth.statusChange', handleStatusChange);
    FB.api('/me/feed', 'post', {
      name: 'MÁS CERCA DEL CIELO', 
      message: 'Mi camino para estar MÁS CERCA DEL CIELO ha comenzado y puedo ser 1 de los asistentes al concierto de FUN y MARTIN SOLVEIG',
      link: 'http://boletos.centenario.com/',
      description: ' ',
      picture: 'http://boletos.centenario.com/assets/web/75x75.png'
    });
  }*/
}
