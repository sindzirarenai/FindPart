var SpareModel = require('../../models/spare');


function Spare(){
}

Spare.prototype.index = function(req, response){
  SpareModel.selectByID(req.params.id, function (err,res){
    if(err) {
      response.send('500',err);
      response.end();
    }else{
      response.render('spare',{spare:res, title:'FindSparePart'});
    }    
    return true;
  })
  return false;
}

module.exports = Spare;