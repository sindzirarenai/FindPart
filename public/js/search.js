$(document).on('submit', 'form#search-form',function(){
  $this = $('form#search-form');
  $button = $('button#search-button');
  $button.prop("disabled", true);  
  $.ajax({
      method:$this.attr('method'),
      url:$this.attr('action'),
      dataType:'json',
      data:$this.serialize(),   
      error:function(error){
        alert(error);
      },         
      success: function(data){    
        data = JSON.parse(data);  
        $tableResult = $('table#results');
        $tableResult.empty();
        $tableResult.append('<tr><td>Номер</td><td>Название</td><td>Цена</td><td>Фото</td><td>Дата</td></tr>');
        for (var i=0; i<data.length; i++){
          var images='';
          for(var j=0; j<data[i].images.length; j++){
            images =images+ '<img src='+data[i].images[j]+'></img>';
          }
         $tableResult.append(
          "<tr>"+
            "<td>"+(i+1)+"</td>"+
            "<td><a href=/spare/"+data[i]._id+">"+data[i].name+"</a></td>"+
            "<td>"+data[i].price+"</td>"+
            "<td>"+images+"</td>"+
            "<td>"+data[i].dateCreate+"</td>"+
            "</tr>"
          ); 
        } 
        $button.prop("disabled", false);
      }
  })
  return false;
}) 