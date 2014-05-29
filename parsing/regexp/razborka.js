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

function getPrice($){
  var price=$('.alt-price').text();
  if (price){
    var price = /\/[\d\s\,]+/.exec(price)[0];
    return price.substring(1, price.length).replace(",", "").trim();
  }else{
    return null;
  }
}

function getImages($){
  var img=[];
  $(".images").find('a').each(function(){
    img.push(config.get("parsers")[3].catalog+$(this).attr('href'));
  });
  return img;
}

function getElement(body){
  $=cheerio.load(body);
  var modelYear = getModelYear($('.breadcrumbs').find('a').eq(2).text());
  var marka = $('.breadcrumbs').find('a').eq(1).text();
  var code = $('.descr').text();
  code=(code)?code.substring(code.indexOf('ОЕ-номер:')+'ОЕ-номер:'.length+1,code.length):null;
  var name = $('h1').text();
  return{
    images:getImages($),
    name:name.substring(0, name.indexOf(marka)-1).toUpperCase(),
    marka: marka,
    model:{name:modelYear.model.toUpperCase(),
          year:modelYear.year},
    section:null,
    about:null,
    price:getPrice($),
    code:code 
  }
}

module.exports = getElement;