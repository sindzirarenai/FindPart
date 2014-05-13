$(document).on('load','form#login-form',function(){
  $('form#login-form').trigger( 'reset' );
  $('mark#error').css("display","none");
})

$(document).on('submit', 'form#login-form',function(){
  $this = $('form#login-form');
  $button = $('button#enter-button');
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
          window.location.href='/search';
        },
        403:function(XHR){
          $('mark.error').css("display","block");
        }
      }
  })
  return false;
}) 

function logOut(){
  $.ajax({
    method:'POST',
    url:'/logout',
    complete:function(){
      window.location.href = '/';
    }
  })
  return false;
}