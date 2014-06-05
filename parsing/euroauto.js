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
  if(err){callback(err,null); return false;}
  else{
      var elementInfo = regexp(body);
      var obj ={
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
      }; console.log(obj); callback(null, obj);
  }
}); 
return false; 
}

function getElements(item, callback){
request(item, function(err,resp, body){
    if(err){callback(err,null); return false;}
    else{
console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('.parts_table').find('a').each(function(i, elem){
          if(/.*подробно.*/.test($(this))){
            arrayHref.push(config.get("parsers")[4].catalog+$(this).attr('href'))
          };
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}

function getPartElements(item,callback){
if(item.indexOf(' ')){
  item.replace(' ','+');
};
request(item, function(err,resp, body){
    if(err){callback(err,null); return false;}
    else{
console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('.ulplusminus').each(function(i, elem){
        if($(this).find('a').length!=0){
          $(this).find('a').each(function(i,elem){
            arrayHref.push(config.get("parsers")[4].catalog+$(this).attr('href'));
          })
        }
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}

function getSectionElements(item,callback){
request(item, function(err,resp, body){
    if(err){callback(err,null); return false;}
    else{
console.log(item);
      $=cheerio.load(body);
      var arrayHref =[];
      $('#parts_left').eq(1).find('a').each(function(i, elem){
        if(i%2==0){
          arrayHref.push(config.get("parsers")[4].catalog+$(this).attr('href'));
        }
      });
      callback(null, arrayHref);
      return true;
    }   
  })
}


function getFirmsElements(item,callback){
request(item, function(err,resp, body){
    if(err){callback(err+' '+resp.statusCode+' '+item,null); return false;}
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
      async.mapLimit(marks, 1, getFirmsElements, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(models, callback){
    console.log(models+' models');
      async.mapLimit(models, 2, getSectionElements, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(sections, callback){
    console.log(sections+ ' sections');
      async.mapLimit(sections,4 , getPartElements, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(parts, callback){
    console.log(parts+' parts');
      async.mapLimit( parts, 6, getElements, function(err,res){callback(err, parsing.createOneArray(res));});
    },
    function(elements, callback){
      async.mapLimit(elements, 8, getElementInfo, function(err,res){callback(err, parsing.createOneArray(res));}); 
    }
  ],callback);
}

module.exports = parse;