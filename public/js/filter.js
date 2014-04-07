function filter(wordForEmpty, id, field, arrayParamValue){
    $.get(
      "/filter",
      {
        field: field,
        param:arrayParamValue
      },
      success=function(data){
        var arr = data.substring(1,data.length-1).split(',');
        $('#'+id).empty();
        if(arr[0]!=''){
          $('#'+id).append('<option>Все</option>');         
          for(var i=0; i<arr.length; i++){
            $('#'+id).append('<option>'+arr[i]+'</option>');
          }
        }else{
          $('#'+id).append('<option>Выбрать '+wordForEmpty+'</option>');  
        }
        
      })
}
