$(document).on('change', 'input#name-type',function(){
  $nameInput=$('#name-input');
  $name = $('#name');
  if ($('#name-type').prop("checked")==true) { 
    $name.prop("disabled", true);
    $nameInput.prop("disabled", false);    
  } else {
    $name.prop("disabled", false);
    $nameInput.prop("value",'');  
    $nameInput.prop("disabled", true); 
   
  }
})


