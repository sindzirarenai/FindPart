var SpareModel = require('../../models/spare');
var acync = require ('async');

function Spare(){
}

Spare.prototype.index = function(req, response){
  async.map(['name', 'model','marka'],
    SpareModel.selectUniqueByField, 
    function(err,res){
      response.render('index', {title:'FindSparePart', name:res[0], model:res[1], marka:res[2]});     
      return true;
    }
  )
}


module.exports = Spare;