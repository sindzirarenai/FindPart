$(document).on('submit',"form#settings-form",function(){
  $button = $('#settings-button');
  $button.prop("disabled", true);  
  $.ajax({
    method:"GET",
    url: "/user/settings/save",
    data:$(this).serialize(),
    success: function(data){
      $button.prop("disabled", false);
      alert("Изменения были сохранены");    
    }
  })
  return false;
})