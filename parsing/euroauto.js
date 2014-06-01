log = require ('../lib/log')(module);
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
date = require('../lib/date');
parsing = require('../lib/parsing');
regexp = require('./regexp/euroauto');

function getElementInfo(item, callback){
request(item, function(err,resp,body){
  if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
  else{
  callback(null, null);
      //var elementInfo = regexp(body);
      /*var obj ={
        name:elementInfo.name,
        section:elementInfo.section,
        model:elementInfo.model,
        marka:elementInfo.marka,
        about:elementInfo.about,
        reference:item,
        code:elementInfo.code,
        site:config.get("parsers")[4].name,
        images:elementInfo.images,
        dateCreate:date.getDateInFormat(new Date()),
        price:elementInfo.price
      }; console.log(obj); callback(null, obj);*/
  }
}); 
return false; 
}

function getElements(item, callback){
request(item, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
    console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('.table parts_table').find('a[text=подробно]').each(function(i, elem){
          arrayHref.push(config.get("parsers")[4].url+$(this).attr('href'));
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}

function getPartElements(item,callback){
request(item, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
    console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('.group_minus').next(".ulplusminus").find('a').each(function(i, elem){
          arrayHref.push(config.get("parsers")[4].url+$(this).attr('href'));
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}

function getSectionElements(item,callback){
request(item, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
    console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('#parts_left').eq(1).find('a').each(function(i, elem){
        if(i%2==0){
          arrayHref.push(config.get("parsers")[4].url+$(this).attr('href'));
        }
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}


function getFirmsElements(item,callback){
request(item, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
    console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('.firms-list').eq(0).find('li').each(function(i, elem){
        if(i>0){
          arrayHref.push(config.get("parsers")[4].url+$(this).find('a').attr('href'));
        }
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}



function parse(callback){
  async.waterfall([
    function(callback){
      getFirmsElements(config.get("parsers")[4].url, callback);
    },
    function(marks, callback){
      async.map(marks, getFirmsElements(item, callback), function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(models, callback){
      async.map(models, getSectionElements(item, callback), function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(sections, callback){
      async.map(sections, getPartElements(item, callback), function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(parts, callback){
      async.map( parts, getElements(item,callback), function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(elements, callback){
      async.map(elements, getElementInfo,function(err,res){callback(err, parsing.createOneArray(res));}); 
    }
  ],callback);
}

module.exports = parse;