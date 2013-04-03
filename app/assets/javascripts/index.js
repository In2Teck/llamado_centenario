var TAB_PAGE = 'http://www.facebook.com/In2Teck?v=app_132164533632870';
var usersHash = {};

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
    var counter = 1;
    $.each(requestsList, function(){
      FB.api(this.toString(), function(response){
        nameList = response.from.name.split(" ");
        usersHash[response.from.id] = nameList[0] + nameList[nameList.length -1];
        counter++;
        if (counter == requestsList.length) {
          selectUsersTower();
        }
      });
    });
  }
  $("#menu div").on("click", onMenuClick);
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

function selectUsersTower() {
  alert(JSON.stringify(usersHash));
}
