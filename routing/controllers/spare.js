var SpareModel = require('../../models/spare');
var acync = require ('async');
var ejs = require ('ejs');


function Spare(){
  var fields = ['name', 'model','marka'];
}

Spare.prototype.index = function(req, response){
  async.map(['name', 'marka'],
    SpareModel.selectUniqueByField, 
    function(err,res){
      response.render('index', {title:'FindSparePart', name:res[0],  marka:res[1], results:null});     
      return true;
    }
  )
}

Spare.prototype.filter = function(req, response){
  SpareModel.selectUniqueByFieldAndValue({field:req.query.field, 
                                          param:req.query.param, 
                                          value: req.query.value},
    function(err,res){
      response.end("'"+res+"'");
      return true;
    });
    return false;
}


module.exports = Spare;