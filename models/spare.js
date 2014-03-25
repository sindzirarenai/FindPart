var Parser = require('../parsing');
var mongoose = require('../lib/db'),
  Schema = mongoose.Schema;

var spare = new Schema({
	code: String,
	name:{
		type:String,
		required:true
	},
	price:{
		type: String,
		required:true
	},
	images:Array,
	section:String,
	model:String,
	marka:String,
	city:String,
	dateCreate:Date,
	dateUpdate: Date,
	code:String,
	reference:String	
});



spare.statics.deleteAll=function(){
  Spare.remove({},function(err,res,opt){
    if(err) {
      log.error(err.message);
      return false;
    }
    return true;
  });
}

spare.statics.addFromParsing= function(cb){
  var pars = new Parser(["zapchastuga"]);
  pars.getNew(function (err,res){
    if (err==null){
      Spare.create(res, cb);
    }
  });
}

var Spare = mongoose.model('Spare', spare);
module.exports= mongoose.model('Spare');
