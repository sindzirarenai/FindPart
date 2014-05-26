cheerio = require('cheerio');
async = require('async');
config = require('../../config');
request = require('request');

function getModelYear(str){
  var yearReg = /[1-2][0-9]{3}/g;
  var years = str.match(yearReg);
  if(years.length>1){
    return (years[0]+'-'+years[1]).trim() ;
  }else{
    return years[0].trim();
  }
}

function getMarkaModel(str,reference){
  var modelReg = /\S+\s/g,
      referenceReg = /\/[\w,-]+/g,
      yearReg = /[1-2][0-9]{3}/;
  var modelMarka = str.match(modelReg);
  for (var i=0; i<modelMarka.length; i++){
    if(modelMarka[i].trim()=='с'||yearReg.test(modelMarka[i])){
      modelMarka.splice(i,1);
    }
  }
  if(reference.match(referenceReg)[2].indexOf('-')!=-1){
    return {marka:modelMarka[0].trim()+' '+modelMarka[1].trim(),
            model:modelMarka.slice(2).join(' ').trim()}
  }else{
    return {marka:modelMarka[0].trim(),
            model:modelMarka.slice(1).join(' ').trim()}
  }
}

function getOther(str, nameOther){
  var regOther = new RegExp(nameOther+":\\S+\\s+[^\\<]*");
  if(regOther.exec(str)!=null){
    var other = regOther.exec(str)[0];
    return other.substring(other.indexOf('>')+1, other.length).trim();
  }else {
    return null;
  }
}

function getPrice(str){
  var regPrice = /Цена:\S+\s+\S+[^\<]*/;
  var price = regPrice.exec(str)[0];
  return price.substring(price.lastIndexOf('>')+1, price.length-4).trim();
}

function getImages($){
  var img=[];
  $("#gallery").find('a').each(function(){
    img.push(config.get("parsers")[1].url+$(this).attr('href'));
  });
  return img;
}

function getElement(body){
  $=cheerio.load(body);
  var htmlProductInfo = $('.product-info').html();
  var markaModelYear = $('.product-info').find('a').eq(1).text();
  var markaModel = getMarkaModel(markaModelYear,$('.product-info').find('a').eq(1).attr('href')); 
console.log('i did');
  return{
    images:getImages($),
    name:$('.breadcrumbs').find('span').eq(2).text().toUpperCase(),
    marka: markaModel.marka.toUpperCase(),
    model:{name:markaModel.model.toUpperCase(),
          year:getModelYear(markaModelYear)},
    section:$('.product-info').find('a').eq(0).text().toUpperCase(),
    about:getOther(htmlProductInfo,'Комментарий'),
    price:getPrice(htmlProductInfo),
    code:getOther(htmlProductInfo,'Артикул')
  }
}

module.exports = getElement;