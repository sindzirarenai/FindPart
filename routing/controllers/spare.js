var SpareModel = require('../../models/spare');


function Spare(){
}

Spare.prototype.index = function(req, response, next){
  SpareModel.selectByID(req.params.id, function (err,res){
    if(err) {
      next(err);
    }else{
      response.render('spare',{spare:res, title:res.name});
    }    
    return true;
  })
  return false;
}

module.exports = Spare;