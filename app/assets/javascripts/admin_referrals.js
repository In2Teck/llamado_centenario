function submitReferral(userId, nombre) {
  var dialogue = confirm("Estás seguro que quieres asignar a " + nombre + " como ganador?");
  if (dialogue == true) {
    $("#user_id")[0].value = userId;
    $("#ticket_form")[0].submit();
  } else { }
}
