$(document).on('change', 'select#marka',function(){
  filter('марку','model.name','model-name',[{marka:this.value}]);
  filter('модель', 'model.year', 'model-year',
        [{'model.name':document.getElementById('model-name').value},
        {marka:this.value}]);
})

$(document).on('change', 'select#model-name',function(){
  filter('модель', 'model.year', 'model-year',
        [{'model.name':this.value},
        {marka:document.getElementById('marka').value}]);
});

function filter(wordForEmpty, field, id, arrayParamValue){
    $.get(
      "/filter",
      {
        field: field,
        param:arrayParamValue
      },
      success=function(data){
        var arr = data.substring(1,data.length-1).split(',');
        $element = $('#'+id);
        $element.empty();
        if(arr[0]!=''){
          $element.append("<option value='all'>Все</option>");         
          for(var i=0; i<arr.length; i++){
            $element.append('<option>'+arr[i]+'</option>');
          }
        }else{
          $element.append("<option value='all'>Выбрать "+wordForEmpty+"</option>");  
        }        
      })
}
