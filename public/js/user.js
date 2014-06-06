
function validateCheck($form, data, message){
  if(!data){
    alert(message);
    $form.trigger('reset');
    resetForm($form);
    return 0;
  }else{
    for (var i =0; i<data.length;i++){
      if(data[i]!=null){
        $("mark#"+data[i].field,$form).text(data[i].message);
        $('mark#'+data[i].field,$form).css("display","block");
      }
    }
    return -1;
  }  
}

function resetForm($form){
  $('mark#user',$form).css("display","none");
  $('mark#password',$form).css("display","none");
  $('mark#passwordRepeat',$form).css("display","none");     
}


$(document).on('submit', 'form#add-form',function(){
  $this = $('form#add-form');
  resetForm($this);
  $button = $('button#add-button');
  $button.prop("disabled", true);  
  $.ajax({
      method:$this.attr('method'),
      url:$this.attr('action'),
      data:$this.serialize(),           
      success: function(data){
        $button.prop("disabled", false);
        if(validateCheck($this,data,"Пользователь был добавлен")==0){
          location.reload();
        }
      } 
    })
   return false;
})

$(document).on('click',"a.editUser",function(event){
  $.get(
      $(this).attr('href'),
      function(data){
        data=JSON.parse(data);
        $form = $("#edit-form");
        $form.css("display","block");
        $("input#username", $form).val(data.username);
        $("input#"+data.role, $form).prop("checked",true);
        $form.prop("action","/user/manager/edit/save/"+data._id);
      }
  )
  return false;
})

$(document).on('click',"a.deleteUser",function(event){
  event.preventDefault();
  if(confirm("Подтвердите удаление пользователя")){
    $.get(
      $(this).attr('href'),
      function(data){
        location.reload();
      }
    )
  }
  return false;
})

$(document).on('submit',"form#edit-form, form#edit-profile",function(){
  passwordEnable=($("#passwordEdit",$(this)).css("display")=='block')?'true':'false';
  $this = $(this);
  resetForm($this);
  $button = $('button#edit-button');
  $button.prop("disabled", true);  
  $.ajax({
      method:$this.attr('method'),
      url:$this.attr('action'),
      data:$this.serialize()+"&passwordEnable="+passwordEnable,   
      success:function(data){
        $button.prop("disabled", false);
        if(validateCheck($this,data,"Изменения были сохранены")==0){;
          $this.css("display","none");
          $("#passwordEdit",$this).css("display","none");
          location.reload();
        }
      }
  })
  return false;
})