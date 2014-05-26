log = require ('../lib/log')(module);
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
date = require('../lib/date');
regexp = require('./regexp/razbor66');

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

function getPageElements(item,callback){
request(item, function(err,resp, body){
console.log('do it');
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
      $=cheerio.load(body);
      var elements=[]
      $('.product-list').find('li').each(function(i,elem){
        var href=$(this).find('.product-item').find('.product_link').attr('href');
        if(href!=undefined){
          elements.push(config.get("parsers")[1].url+href);
        }
      })
      async.map(elements, getElementInfo, callback); 
      return true;
    }   
  })
}

function getMarkaElements(item, callback){
request(item, function(err,resp, body){
  if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
  else{
    $=cheerio.load(body);
    var countPage = Math.floor(parseInt($('#countresultInResult').text())/60)+1;
    var pagesHref=[];
    for(var i=0; i<countPage; i++){
      pagesHref.push(item+'?&countonpage=60&page='+i);
    };
    async.mapSeries(pagesHref, getPageElements, callback);
    return true;
  }
})
return false;
}


function parse(callback){
  request(config.get("parsers")[1].catalog, function(err,resp, body){
    if(err||resp.statusCode!=200){callback(err+' '+resp,null); return false;}
    else{
      $=cheerio.load(body);
      var marksHref =[];
      $("#Marka").find('option').each(function(i, elem){
        if(i>0){
          marksHref.push(config.get("parsers")[1].catalog+$('#hiddenValues').find('[attr='+$(this).attr().value+']').attr('url'));
        }
      });
      async.mapSeries(marksHref, getMarkaElements, callback);
      return true;
    }
  })
  return false;
}

module.exports = parse;