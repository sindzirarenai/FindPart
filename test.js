var Spare = require('./models/spare');
var mongoose = require('./lib/db');

sp = new Spare();
Spare.deleteAll();
Spare.addFromParsing(function(err,res){
  console.log('done');
  mongoose.disconnect();
});
