cheerio = require('cheerio');
async = require('async');
config = require('../../config');

function getModelYear(str){
  var yearReg = /[1-2][0-9]{3}[-]?[1-2]*[0-9]*/;
  var index = str.search(yearReg);
  if(index!=-1){
    return {model:str.substring(0,index-1).trim(), year:yearReg.exec(str)[0]};
  }else{
    return {model:str, year:null};
  }
}

function getImages($){
  var img=[];
  $(".thumbnails").find('img').each(function(){
    img.push($(this).attr('content'));
  });
  return img;
}

function getElement(body){
  $=cheerio.load(body);
  var modelYear = getModelYear($('.table-bordered').find('tr').eq(1).find('td').text().split(';')[0]); 
  return{
    images:getImages($),
    name:$('.table-bordered').find('tr').eq(2).find('td').text().toUpperCase(),
    marka:$('.table-bordered').find('tr').eq(0).find('td').text().split(',')[0] ,
    model:{name:modelYear.model.toUpperCase(),
          year:modelYear.year},
    section:null,
    about:$('.table-bordered').find('tr').eq(3).find('td').text()+' '+$('.table-bordered').find('tr').eq(6).find('td').text(),
    price:$('.table-bordered').find('tr').eq(7).find('td').text(),
    code:$('.table-bordered').find('tr').eq(4).find('td').text()
  }
}

module.exports = getElement;