function parsing(){}

/*get one array from array of arrays*/
parsing.createOneArray=function(res){
  var arr=[];
  for(var i=0; i<res.length; i++){
    if(res[i]!=null) arr=arr.concat(res[i]);          
  }  
  return arr;
}

module.exports = parsing;

