var User = require('../models/user');
var async = require('async');

function Validator(){ 
}

validateUsername= function(oldUsername, username, callback){
  if(username==undefined||username.trim()=='') {
    callback(null,{field:'user', message:'Имя пользователя не должно быть пустым'});
  }else{
    User.findByUsername(username, function(err,res){
      if(err) {callback(err,null);} 
      else if((res&&oldUsername==null)||(res&&oldUsername!=null&&res.username!=oldUsername)){
        callback(null,{field:'user', message:'Такой пользователь уже существует'});
      }else{ 
        callback(null,null);
        return true;
      }      
    })
  }
  return false;
}

validatePassword = function(password, passwordRepeat, callback){
  if(password==undefined||password.trim()=='') {
    callback(null,{field:'password', message:'Пароль не должен быть пустым'});
  }else if (password!=passwordRepeat){
    callback(null,{field:'passwordRepeat', message:'Пароли должны совпадать'});
  }else{
    callback(null,null);
    return true;
  }
}

Validator.prototype.validateUser = function(passwordEnable, oldUsername, username, password,passwordRepeat, callback){
  async.parallel([
    function(callback){validateUsername(oldUsername, username, callback);},
    function(callback){
      if(passwordEnable=='true'){
        validatePassword(password, passwordRepeat, callback);
      }else{callback(null,null);}
    }],
    function(err,errors){
      if(err){callback(err,null);}
      else{
        if (errors[0]==null&&errors[1]==null){
          callback(null,null);
        }else{
          callback(null,errors);
        }
      }  
    })
  return true;  
}

module.exports = Validator;
