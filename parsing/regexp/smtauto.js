cheerio = require('cheerio');
async = require('async');
config = require('../../config');
request = require('request');

function getModelYear(str){
  var yearReg = /[1-2][0-9]{3}[-]?[1-2]*[0-9]*/;
  var index = str.search(yearReg);
  if(index!=-1){
    return {model:str.substring(0,index-1).trim(), year:yearReg.exec(str)[0]};
  }else{
    return {model:str, year:null};
  }
}

function getProperties($){
  var properties={};
  $('.tr-descr').find('.t').each(function(i,elem){
    properties[$(this).text()]=$('.c').eq(i).text();
  });
  return properties;
}

function getImages($){
  var img=[];
  $(".small_imgs").find('a').each(function(){
    img.push(config.get("parsers")[2].url+'/'+$(this).attr('href'));
  });
  return img;
}

function getElement(body){
  $=cheerio.load(body);
  var modelYear = getModelYear($('.text-right').find('a').eq(2).text().toUpperCase());
  var properties = getProperties($);
  return{
    images:getImages($),
    name:$('.text-right').find('a').eq(4).text().toUpperCase(),
    marka: $('.text-right').find('a').eq(1).text().toUpperCase(),
    model:{name:modelYear.model.toUpperCase(),
          year:modelYear.year},
    section:$('.text-right').find('a').eq(3).text().toUpperCase(),
    about:properties['Описание'],
    price:$('.tr-pricebutton').find('.value').text(),
    code:properties['Ориг. номер']
  }
}

module.exports = getElement;