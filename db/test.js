var db = require('./index');
var Spare = require('../models/spare').Spare;

var spare = new Spare({name:"spare1", price:"2500"});
spare.save(function(err, user, affect){
	if (err) throw err;
});

(Spare.findOne({name:"spare1"}, function (err, spare){
	console.log(spare);
}));