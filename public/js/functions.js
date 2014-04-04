function changeNameInputType(){
  if ($('#nameType').prop("checked")==true) { 
    $('#name').prop("disabled", true);
    $('#nameInput').prop("disabled", false);    
  } else {
    $('#name').prop("disabled", false);
    $('#nameInput').prop("disabled", true);       
  }
}