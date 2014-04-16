$(document).on('change', 'input#name-type',function(){
  if ($('#name-type').prop("checked")==true) { 
    $('#name').prop("disabled", true);
    $('#name-input').prop("disabled", false);    
  } else {
    $('#name').prop("disabled", false);
    $('#name-input').prop("disabled", true);       
  }
})