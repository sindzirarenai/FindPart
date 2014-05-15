var User = require('../models/user');
var async = require('async');

function Validator(){ 
}

Validator.prototype.validateUsername= function(username, callback){
  if(username==undefined||username.trim()=='') {
    callback(null,{field:'user', message:'Имя пользователя не должно быть пустым'});
  }else{
    User.findByUsername(username, function(err,res){
      if(err) {callback(err,null);} 
      else if(res!=null){
        callback(null,{field:'user', message:'Такой пользователь уже существует'});
      }else{ 
        callback(null,null);
        return true;
      }      
    })
  }
  return false;
}

Validator.prototype.validatePassword = function(password, passwordRepeat, callback){
  if(password==undefined||password.trim()=='') {
    callback(null,{field:'password', message:'Пароль не должен быть пустым'});
  }else if (password!=passwordRepeat){
    callback(null,{field:'passwordRepeat', message:'Пароли должны совпадать'});
  }else{
    callback(null,null);
    return true;
  }
}

Validator.prototype.checkNoErrors=function(errors){
  var noError = 0;
  for(var i =0; i<errors.length; i++){
    if(errors[i]==null){noError++}
  }
  if (noError==errors.length){ return true}
  else{return false;}
}

Validator.prototype.validateUser = function(username, password,passwordRepeat, callback){
  var errors=[];
  this.validateUsername(username, function(err,userErrors){
    if(err){callback(err,null); return false;}
    errors.push(userErrors);
  })
  this.validatePassword(password, passwordRepeat, function(err, passwordErrors){
    if(err){callback(err,null); return false;}
    errors.push(passwordErrors);
  })
  if (this.checkNoErrors(errors)){
    callback(null,null);
  }else{
    callback(null,errors);
  }
  return true;
}

module.exports = Validator;
