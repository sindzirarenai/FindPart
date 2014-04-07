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
	model:{
    name:String,
    year:String
  },
	marka:String,
	city:String,
	dateCreate:Date,
	dateUpdate: Date,
	about:String,
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

spare.statics.addFromParsing= function(callback){
  var pars = new Parser(["zapchastuga"]);
  pars.getNew(function (err,res){
    if (err==null){
      Spare.create(res, callback);
    }else{
      log.error(err);
      console.log(err);
      callback(err, null);
    }
  });
}

spare.statics.selectUniqueByField=function(field, callback){
  Spare.distinct(field, callback);
}

spare.statics.selectUniqueByFieldAndValue=function(query, callback){
  Spare
    .where()
    .and(query.param)
    .distinct(query.field)
    .exec(function(err,res){
      callback(err,res);
    });
}

var Spare = mongoose.model('Spare', spare);
module.exports= mongoose.model('Spare');
