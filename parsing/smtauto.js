log = require ('../lib/log')(module);
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
date = require('../lib/date');
parsing = require('../lib/parsing');
regexp = require('./regexp/smtauto');

function getElementInfo(item, callback){
request(item, function(err,resp,body){
  if(err||resp.statusCode>=400){callback(err+' '+resp,null); return false;}
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
        site:config.get("parsers")[2].name,
        images:elementInfo.images,
        dateCreate:date.getDateInFormat(new Date()),
        price:elementInfo.price
      });
 }
}); 
return false; 
}

function parseElements(item, callback){
console.log(href);
  request(item, function(err,resp, body){
    if(err||resp.statusCode>=400){callback(err+' '+resp,null); return false;}
    else{
      $=cheerio.load(body);
      var arrayHref =[];
      console.log($('.parts_content').find('.descr'));
      if($('.parts_content').find('.descr').length>0){
        $('.parts_content').find('.descr').each(function(){
          arrayHref.push(config.get("parsers")[2].url+$(this).find('a').eq(0).attr('href'));
        })
      }
      callback(null, arrayHref);
    } 
  })   
}

function parseHrefs(id, href, callback){
console.log(href);
  request(href, function(err,resp, body){
    if(err||resp.statusCode>=400){callback(err+' '+resp,null); return false;}
    else{
      $=cheerio.load(body);
      var arrayHref =[];
      if($('.'+id).find('a').length>0){
        $('.'+id).find('a').each(function(){
          arrayHref.push(config.get("parsers")[2].url+$(this).attr('href'));
        })
      }
      console.log(arrayHref);
      callback(null, arrayHref);
    } 
  }) 
}

function parseGroups(item,callback){
  parseHrefs('parts_content',item,callback);
}

function parseList(item, callback){
  parseHrefs('small_list',item,callback);
}

function parse(callback){
  async.waterfall([
    function(callback){
       parseList(config.get("parsers")[2].catalog, callback);
    },
    function(marks, callback){
      async.map(marks, parseList, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(models,callback){
      async.mapSeries(models, parseGroups, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(sections, callback){
      async.mapSeries(sections, parseGroups, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(names, callback){
      async.mapSeries(names, parseElements, function(err,res){callback(err, parsing.createOneArray(res));});     
    },
    function(elements, callback){
    console.log(elements);
      async.map(elements, getElementInfo, callback);         
    }],
    callback)
}

module.exports = parse;