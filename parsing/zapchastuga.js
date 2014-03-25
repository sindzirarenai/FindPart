log = require ('../lib/log');
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');

/*get one array from array of arrays*/
function createOneArray(res){
  var arr=[];
  for(var i=0; i<res.length; i++){
    if(res[i]!=null) arr=arr.concat(res[i]);          
  }  
  return arr;
}

/*get catefories from table.cats_table_root*/
function getCats(object, callback){
  request(config.get("parsers")[0].url+object.href, function (err, response, body){
    if(err){callback(err,null); return false;}
    $ = cheerio.load(body);			
    var length = $("table.cats_table_root").length;		
    if (length>0){
      callback(null, $("table.cats_table_root").find('a').map(function(){
        var t=object.str+$(this).text()+'~~';
        return {href:$(this).attr('href'),str:t};
      }).toArray())
    }else{
      callback(null,null);
    }
  })
}
		
/*catalog's elements from prods_table_root*/	
function getProds(object, callback){
  request(config.get("parsers")[0].url+object.href, function (err, response, body){   
    if(err){callback(err,null); return false;}   
    $ = cheerio.load(body);	
    callback(null, $("table.prods_table_root").find('a').map(function(){
      return {href:$(this).attr("href"),str:object.str};
    }).toArray());
  })
}
	
/*get object from str, tr(excpet tr=0, header), td, get image*/ 		function getObjects(object, callback){
  request(config.get("parsers")[0].url+object.href, function (err, response, body){ 
    if(err){callback(err,null); return false;}
    $=cheerio.load(body);  
    callback(null, $("table.prods_table").find('tr').map(function(i, elem){
      if (i>0){
        var img=[];
        var td=[];   												
          $(elem).find('#single_image').each(function(i,item){
            img.push(config.get("parsers")[0].url+$(this).attr('href'));
          })									
          $(elem).find('td').each(function(i,elem){
            td.push($(this).text());
          });									
          var st = object.str.split('~~');					
          return{name:td[0], price:td[2], section:st[2], model: st[1], marka: st[0], reference:object.href, images:img};
      }
    }).toArray())	
  })		
};


/*parsing, get catalog's member*/
function parse(callback){ 
  getCats({href:"catalogue.php", str:''}, function (err,result){
    if(err){callback(err,null); return false;}
    async.map(result, getCats, function(err,res){
      if(err){callback(err,null); return false;}
      async.map(createOneArray(res), getCats, function(err,res){
        if(err){callback(err,null); return false;}
        async.map(createOneArray(res), getProds, function(err,res){
          if(err){callback(err,null); return false;}
          async.map(createOneArray(res), getObjects, function(err,res){
            if(err){callback(err,null); return false;}
            log.info('Parsing zapchastuga done');
            callback(null,createOneArray(res));      
          });
        });
      });
    });
  })
}		  

module.exports=parse;