function resetFormAdd(){
  $('mark#user').css("display","none");
  $('mark#password').css("display","none");
  $('mark#passwordRepeat').css("display","none");     
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
      success: function(data){
        resetFormAdd();
        if(!data){
          alert('Пользователь был добавлен');
          $this.trigger('reset');
        }else{
          for (var i =0; i<data.length;i++){
            if(data[i]!=null){
              $("mark#"+data[i].field).text(data[i].message);
              $('mark#'+data[i].field).css("display","block");
            }
          }
        }} 
    })
   return false;
})