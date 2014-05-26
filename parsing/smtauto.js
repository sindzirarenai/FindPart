log = require ('../lib/log')(module);
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
date = require('../lib/date');
regexp = require('./regexp/smtauto');

var count=0;

function getElementInfo(item, callback){
request(item, function(err,resp,body){
count++;
console.log(count+' '+item);
  if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
  else{
      var elementInfo = regexp(body);
      callback(null, {
        name:elementInfo.name,
        section:elementInfo.section,
        model:elementInfo.model,
        marka:elementInfo.marka,
        about:elementInfo.about,
        reference:item,
        code:elementInfo.code,
        site:config.get("parsers")[0].name,
        images:elementInfo.images,
        dateCreate:date.getDateInFormat(new Date()),
        price:elementInfo.price
      });
 }
}); 
return false; 
}

function parseHrefs(class, href, callback){
  var arrayHref =[];
  request(href, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
      $=cheerio.load(body);
      $('.'+class).find('a').each(function(i,elem){
        arrayHref.push(config.get("parsers")[2].url+$(this).attr('href'));
      })
      callback(null, arrayHref);
    } 
  })
}

function parse(callback){
  parseSmallList('small-list',config.get("parsers")[2].catalog, function(err,res){
    console.log(res);
    callback(null,null);
  })
}

module.exports = parse;