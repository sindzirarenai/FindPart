var Spare = require('./models/spare');
var mongoose = require('./lib/db');
var log = require('./lib/log')(module);
var request = require('request');

/*var parse = require('./parsing/razbor66');
parse(function(err,res){
  console.log('err='+err+' result='+res.length);
  mongoose.disconnect();
});*/

/*var reg = require('./parsing/regexp/razbor66');
reg(null);*/

/*Spare.addFromParsing(function(err,res){
  if(err) log.error(err);
  log.info('done');
  mongoose.disconnect();
});*/

/*var parse = require('./parsing/smtauto');
parse(function(err,res){
  console.log('err='+err+' result='+res.length);
  mongoose.disconnect();
});*/

/*var reg = require('./parsing/regexp/smtauto');
request('http://www.smtauto.ru/parts_used/10/451/17/47/52174713451', function(err,resp,body){
  reg(body);  
})*/

var parse = require('./parsing/razborka');
parse(function(err,res){
  console.log('err='+err+' result='+res.length);
  mongoose.disconnect();
});

/*var reg = require('./parsing/regexp/razborka');
request('http://www.smtauto.ru/parts_used/10/451/17/47/52174713451', function(err,resp,body){
  reg(body);  
})*/