var db = require('../db'),
	Schema = db.Schema;

var Spare = new Schema({
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
	label:String,
	date:Date,
	code:String	
});

exports.Spare = db.model('spare', Spare);