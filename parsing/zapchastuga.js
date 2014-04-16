log = require ('../lib/log');
request = require('request');
cheerio = require('cheerio');
config = require('../config');
async = require('async');
download = require('download');

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
  var yearFindIndex = model.search(new RegExp(/\(\d{4}--.*\)/));
  return {model:yearFindIndex!=-1?model.substring(0,yearFindIndex-1):model, 
          year: yearFindIndex!=-1?model.substring(yearFindIndex+1, model.length-1).replace(new RegExp("\-{2}"),'-'):undefined};
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
	
  
function getImages(elem){
  return $(elem).find('#single_image').map(function(i,item){
    $image = $(this).attr('href');
    var nameImg = new RegExp(/p=\d*/).exec($image)[0];
    nameImg=nameImg.substring(2,nameImg.length);
    download({url:config.get("parsers")[0].url+$image, name:nameImg},config.get('loadDir'));
    return config.get('loadDir')+'/'+nameImg;
  }).toArray();	
}

/*get object from str, tr(excpet tr=0, header), td, get image*/ 		
function getObjects(object, callback){

  request(config.get("parsers")[0].url+object.href, function (err, response, body){ 
    if(err){callback(err,null); return false;}
    $=cheerio.load(body);  
    callback(null, 
      $("table.prods_table").find('tr').map(function(i, elem){
      if (i>0){
        var img=[];
        var td=[];   																				
          $(elem).find('td').each(function(i,elem){
            td.push($(this).html());
          });									
          var st = object.str.split('~~'),	
              nameParsing=parseName(td[0]),	
              modelParsing = parseModel(st[1]);
          return{
            name:nameParsing.name, 
            code: nameParsing.code, 
            about:nameParsing.about, 
            price:td[2], 
            section:st[2], 
            model: {name: modelParsing.model,
              year:modelParsing.year}, 
            marka: st[0], 
            reference:object.href, 
            images:getImages($(elem)),
            site:'zapchastuga',
            dateCreate:new Date().toLocaleString()
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
            if(err){callback(err,null); return false;}
            log.info('Parsing zapchastuga done');
            console.log('Parsing zapchastuga done');
            callback(null,createOneArray(res));      
          });
        });
      });
    });
  })
}		  

module.exports=parse;