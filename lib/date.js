
function date(){
}

date.getDateInFormat=function(date){
  var day= parseInt(date.getDate())<10?'0'+date.getDate():date.getDate(),
      month=parseInt(date.getMonth())<10?'0'+date.getMonth():date.getMonth(),
      year = date.getFullYear();
  return(day+'.'+month+'.'+year);
}

module.exports = date;