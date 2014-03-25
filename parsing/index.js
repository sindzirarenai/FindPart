async = require ('async');
log = require ('../lib/log');

function Parser(sites){
  this.sites = sites;
  this.elements=[];
}

Parser.prototype.getNew = function(callback){
  var data=[];
  async.concat(this.sites, getNewOne, function(err,res){callback(err,res)});
  
  function getNewOne(parser, callback){
    var parse = (require('./'+parser));
    parse(function(err,res){
      if(err==null){
        callback(null, res);
      }else{
        log.error(err.message);
        callback(err, null);
      }
    })
  };
} 

module.exports = Parser;
/*
parser = new Parser(["zapchastuga"]);
parser.getNew(function (err,res){
  console.log(res[125].name);
});*/