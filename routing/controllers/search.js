var SpareModel = require('../../models/spare');
var acync = require ('async');

function Search(){
  var fields = ['name', 'model','marka'];
}

Search.prototype.index = function(req, response, next){
  async.map(['name', 'marka'],
    SpareModel.selectUniqueByField, 
    function(err,res){
      if(err) {
        next(err);
      }else {
        response.render(
          'search', 
          { title:'FindSparePart', name:res[0], marka:res[1]});     
      }
      return true;
    })
  return false;
}

Search.prototype.find = function(req, response, next){
  async.map(['name', 'code', 'marka', 'model.name', 'model.year'],
    function(elem, callback){
      if(elem=='name' && (req.param('name-input')||req.param('name')!='all' ) ){
        if(req.param('name-type') ) callback(null, {name: new RegExp(req.param('name-input')+'.*',"i")});
        else  callback(null, JSON.parse('{"name": "'+req.param('name')+'"}'));
      }else{
        if (req.param(elem)&& req.param(elem)!='all' ) callback(null,JSON.parse('{"'+elem+'":"'+req.param(elem)+'"}'));
        else callback(null,null);
      }
    },
    function(err,res){
      SpareModel.selectSparesByFields(res,
        function(err,res){
        if(err) {
            next(err);
          }else {
            response.end(JSON.stringify(res));
          }
          return true
        })
    }) 
  return false;
}

Search.prototype.filter = function(req, response, next){
  SpareModel.selectUniqueByFieldAndValue(
    {field:req.query.field, 
     param:req.query.param, 
     value: req.query.value},  
    function(err,res){
      if(err) {
       next(err);
       response.end();
      }else {
        response.end("'"+res+"'");
      }
      return true;
    });
    return false;
}

module.exports = Search;