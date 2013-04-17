function modalAlert(title, message, options){
  $("#modal-title")[0].innerHTML = title;
  $("#modal-content")[0].innerHTML = message;
  $("#modal-alert").modal(options);
}

