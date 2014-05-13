function resetForm(){
  $('mark#user').css("display","none");
  $('mark#password').css("display","none");   
}

$(document).on('submit', 'form#add-form',function(){
  $this = $('form#add-form');
  $button = $('button#add-button');
  $button.prop("disabled", true);  
  $.ajax({
      method:$this.attr('method'),
      url:$this.attr('action'),
      data:$this.serialize(),           
      complete: function() {
        $(":submit", form).button("reset");
      },
      statusCode:{
        200: function(){
          resetForm();
          alert('Пользователь добавлен');
          $this.trigger('reset');  
        },
        206:function(XHR){
          resetForm();
          $('mark#user').css("display","block");
        },
        204:function(XHR){
          resetForm();
          $('mark#password').css("display","block");
        }
      }
  })
  return false;
}) 