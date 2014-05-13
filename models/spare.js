var Parser = require('../parsing');
var mongoose = require('../lib/db'),
  Schema = mongoose.Schema;
var log = require('../lib/log')(module);

var spare = new Schema({
	code:String,
	name:{
		type:String,
		required:true,
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
	dateCreate:String,
	dateUpdate:String,
	about:String,
	reference:{
    type:String,
    unique:true,
    required:true
  },
  site:String	
});



spare.statics.deleteAll=function(callback){
  Spare.remove({},function(err,res,opt){
    if(err) {
      log.error(err.message);
      callback(err,null);
    }
    callback(null,true);
  });
}

spare.statics.addFromParsing= function(callback){
  var pars = new Parser(["zapchastuga"]);
  pars.getNew(function (err,res){
    if (err==null){
      Spare.create(res, callback);
    }else{
      log.error(err);
      callback(err, null);
    }
  });
}

spare.statics.selectByID=function(id, callback){
  Spare.findById(id).exec(callback);
}

spare.statics.selectUniqueByField=function(field, callback){
  Spare
  .where()
  .distinct(field)
  .exec(function(err,res){
    if(err) callback(err,null);
    else callback(null, res.sort());
  });
}

spare.statics.selectSparesByFields=function(fields, callback){
  Spare
    .where()
    .and(fields)
    .exec(function(err,res){
      if(err) callback(err,null);
      else callback(null, res.sort());
    });
}

spare.statics.selectUniqueByFieldAndValue=function(query, callback){
  Spare
    .where()
    .and(query.param)
    .distinct(query.field)
    .exec(function(err,res){
      if(err) callback(err,null);
      else callback(null, res.sort());
    });
}

var Spare = mongoose.model('Spare', spare);
module.exports= mongoose.model('Spare');