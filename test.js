var Spare = require('./models/spare');
var mongoose = require('./lib/db');
var log = require('./lib/log');

sp = new Spare();
Spare.deleteAll(function(err,res){log.info('delete all spares');});
Spare.addFromParsing(function(err,res){
  if(err) log.error(err);
  log.info('done');
  mongoose.disconnect();
});
