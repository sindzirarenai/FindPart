async = require ('async');
log = require ('../lib/log')(module);

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
