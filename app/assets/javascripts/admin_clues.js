function activateWebClue(clueId) {
  var dialogue = confirm("¿Estás seguro que quieres activar la pista? Todas las demás se desactivarán.");
  if (dialogue == true) {
    $.ajax({
      type: "POST",
      url: "/clues/" + clueId + "/activate_web",
      dataType: "json",
      beforeSend: function() {
        // waiting ...
      },
      success: function(){
        window.location = "/admin/clues_list_web";
      },
      error: function() {
        alert("Error. Falla de comunicación con el servidor. Intenta nuevamente.");
      } 
    }); 
  } else { }
}

function activateMobileClue(clueId) {
  var dialogue = confirm("¿Estás seguro que quieres activar la pista?");
  if (dialogue == true) {
    $.ajax({
      type: "POST",
      url: "/clues/" + clueId + "/activate",
      dataType: "json",
      beforeSend: function() {
        // waiting ...
      },
      success: function(){
        window.location = "/admin/clues_list_mobile";
      },
      error: function() {
        alert("Error. Falla de comunicación con el servidor. Intenta nuevamente.");
      } 
    }); 
  } else { }
}

function deactivateMobileClue(clueId) {
  var dialogue = confirm("¿Estás seguro que quieres desactivar la pista?");
  if (dialogue == true) {
    $.ajax({
      type: "POST",
      url: "/clues/" + clueId + "/deactivate",
      dataType: "json",
      beforeSend: function() {
        // waiting ...
      },
      success: function(){
        window.location = "/admin/clues_list_mobile";
      },
      error: function() {
        alert("Error. Falla de comunicación con el servidor. Intenta nuevamente.");
      } 
    }); 
  } else { }
}
