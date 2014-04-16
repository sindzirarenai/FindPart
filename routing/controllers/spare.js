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
      if(err) {
        response.send('500',err);
        response.end();
      }else {
        response.render(
          'index', 
          {title:'FindSparePart', name:res[0], marka:res[1]});     
      }
      return true;
    }
  )
  return false;
}

Spare.prototype.search = function(req, response){
  async.map(['name', 'code', 'marka', 'model.name', 'model.year'],
    function(elem, callback){
      if(elem=='name' && req.param(elem) && req.param('input-type')){
        callback(null, JSON.parse('{"name": "/'+req.param('name-input')+'/i"}'));
      }else{
        if (req.param(elem)&& req.param(elem)!='all' ){
          callback(null,JSON.parse('{"'+elem+'":"'+req.param(elem)+'"}'));
        }else{
          callback(null,null);
        }}},
    function(err,res){
      SpareModel.selectSparesByFields(res,
        function(err,res){
        if(err) {
            response.json('500',err);
          }else {
            response.json(JSON.stringify(res));
          }
          response.end();
          return true
        })
    }) 
  return false;
}

Spare.prototype.filter = function(req, response){
  SpareModel.selectUniqueByFieldAndValue(
    {field:req.query.field, 
     param:req.query.param, 
     value: req.query.value},  
    function(err,res){
      if(err) {
        response.send('500',err);
      }else {
        response.send("'"+res+"'");
      }
      response.end();
      return true;
    });
    return false;
}


module.exports = Spare;