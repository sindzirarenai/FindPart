async = require ('async');
log = require ('../lib/log')(module);
Spare = require('../models/spare');

function Parser(sites){
  this.sites = sites;
  this.elements=[];
}

Parser.prototype.getNewOne = function(parser,callback){
  var parse = (require('./'+parser));
    parse(function(err,res){
      if(err==null){
        callback(null, res);
      }else{
        log.error(err.message);
        callback(err, null);
      }
    })
}

Parser.prototype.getNew = function(callback){
  async.concatSeries(this.sites, this.getNewOne, callback);
} 

module.exports = Parser;
