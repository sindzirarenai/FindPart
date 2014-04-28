var count_paginator = 20;

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
        alert('Error: '+error.message);
      },         
      success: function(data){    
        data = JSON.parse(data); 
        $('ol#pagination').empty(); 
        $results = $('ul#items');
        $results.empty();
        for (var i=0; i<data.length; i=i+count_paginator){
          $results.append('<li><table class="width-100" id="results-'+i+'"></table></li>');
          $table = $('table#results-'+i);
          $table.append('<tr><td>Номер</td><td>Название</td><td>Цена</td><td>Фото</td><td>Дата</td></tr>');  
          dataLength = (data.length-i)>count_paginator?count_paginator:data.length%count_paginator;    
          for(var j=i; j<i+dataLength; j++){
            var images='';
            /*for(var j=0; j<data[i].images.length; j++){
              images =images+ '<img src='+data[i].images[j]+'></img>';
            }*/
            $table.append(
              "<tr>"+
              "<td>"+(j+1)+"</td>"+
              "<td><a href=/spare/"+data[j]._id+">"+data[j].name+"</a></td>"+
              "<td>"+data[j].price+"</td>"+
              "<td>"+images+"</td>"+
              "<td>"+data[j].dateCreate+"</td>"+
              "</tr>"
            );  
          }
        } 
        $('ul#items').easyPaginate({step:1});
        $button.prop("disabled", false);
      }
  })
  return false;
}) 