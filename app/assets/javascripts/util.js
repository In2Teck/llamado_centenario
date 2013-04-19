function modalAlert(title, message, options){

  if (options == null) {
    options = {};    
  }
  options["closeClass"] = "closeClass";

  $("#modal-title")[0].innerHTML = title;
  $("#modal-content")[0].innerHTML = message;
  $("#modal-alert").modal(options);
}

function modalDialogue(title, message, usersHash, options){
  
  if (options == null) {
    options = {};    
  }
  options["closeClass"] = "dialogueClass";
  options["minHeight"] = 300;
  options["minWidth"] = 400;

  $("#modal-title")[0].innerHTML = title;
  $("#modal-content")[0].innerHTML = message;
  $("#modal-content").append("<br/><br/>");
  $.each(usersHash, function(value, key){
    // ADDING USER REQUESTS
    $("#modal-content").append("<div id='"+value+"'>"+key+"</div>");
    $("#"+value).append("<a href='#' onclick='acceptRequest("+value+")'>aceptar invitación</a>");
  });
  $("#modal-alert").modal(options);
}
