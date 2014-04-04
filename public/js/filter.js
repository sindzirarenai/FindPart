function filter(id, field, param, value){
    $.get(
      "/filter",
      {
        field: field,
        param:param,
        value:value
      },
      success=function(data){
        var arr = data.substring(1,data.length-1).split(',');
        if(arr[0]!=''){
          $('#'+id).empty(); 
          $('#'+id).append('<option>Все</option>');         
          for(var i=0; i<arr.length; i++){
            $('#'+id).append('<option>'+arr[i]+'</option>');
          }
        }
      })
}
