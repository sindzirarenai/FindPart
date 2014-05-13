log = require ('../lib/log')(module);
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
date = require('../lib/date');

function parseName(td){
  var regName= new RegExp(/.*?<br>/),
      regCode=new RegExp(/О\/Н:[^\(\)]+/),
      regAbout=new RegExp(/Товар забронирован|\(.*\)/);
  return {
    name: (td.search(regName)!=-1)?regName.exec(td)[0].slice(0,-4):td,
    code: (td.search(regCode)!=-1)?regCode.exec(td)[0].slice(8,-4):undefined,
    about:(td.search(regAbout)!=-1)?regAbout.exec(td)[0]:undefined
  }
}

function parseModel(model){
  var regYearModel = new RegExp(/\d{4}\s?-{1,2}\s?\d*/);
  var indexSearch = model.search(regYearModel);   
  var year= (indexSearch!=-1)?regYearModel.exec(model)[0].replace(new RegExp("\-{2}"),'-'):undefined;
  var model=(indexSearch!=-1)?model.substring(0,indexSearch-2):model;
  return {model:model, year:year};          
}

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


/*get object from str, tr(excpet tr=0, header), td, get image*/ 		
function getObjects(object, callback){
  request(config.get("parsers")[0].url+object.href, function (err, response, body){ 
    if(err){callback(err,null);return false;}
    $=cheerio.load(body);  
    callback(null, 
      $("table.prods_table").find('tr').map(function(i, elem){
      if (i>0){
        var img=[];
        var td=[];   																				
          $(elem).find('td').each(function(i,elem){
            td.push($(this).html());
          });			
          $(elem).find('#single_image').each(function(i,elem){
            img.push($(this).attr('href'));
          });						
          var st = object.str.split('~~'),	
              nameParsing=parseName(td[0]),	
              modelParsing = parseModel(st[1]);             
          return{
            name:nameParsing.name.toUpperCase(), code: nameParsing.code, 
            about:nameParsing.about, price:td[2], section:st[2], 
            model: {name: modelParsing.model.toUpperCase(), year:modelParsing.year}, 
            marka: st[0].toUpperCase(), 
            reference:config.get("parsers")[0].url+object.href, 
            images:img, site:'zapchastuga',
            dateCreate:date.getDateInFormat(new Date())
          };
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
            if(err){ console.log('here'); callback(err,null);return false;}
            log.info('Parsing zapchastuga done');
            callback(null,createOneArray(res));      
          });
        });
      });
    });
  })
}		  

module.exports=parse;