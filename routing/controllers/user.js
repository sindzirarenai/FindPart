var UserModel = require('../../models/user');


function User(){
}

User.prototype.logIn = function(req, response, next){
  response.render('index',{title:'FindSparePart'});
  return true;
}

User.prototype.index = function(req,response,next){
  UserModel.findUser(req.user._id, function(err,res){
    if(err) next(err);
    response.render('user',{title:'Личный кабинет'});   
  })
}

User.prototype.enter = function(req,response, next){
  UserModel.authenticate({username:req.param('username'), password: req.param('password')}, 
  function(err,res){
    if (!err){
      if(res.status==200){
        req.session.user = res.user._id;
        response.send(200);
      }else{
        response.send(403,'Неверный логин и/или пароль');
      }
    }else{
      next(err);
    }
  })
  return true;
}

User.prototype.logOut = function(req,response,next){
  if(req.session.user){
    req.session.destroy();
  }
  res.end();
}

User.prototype.addUser = function(req,response, next){
  UserModel.findByUsername(req.param('username'), function(err,res){
    if(err){next(err)}
    else{  
      if(res!=null) {
        response.send(206,{error:'Такой пользователь уже существует'})
      }else{
        if(req.param('password')==undefined|| req.param('password').trim()==''){ 
          response.send(204,{error:'Пароль не может быть пустым'}) 
        }else{     
          UserModel.addUser(req.param('username'), req.param('password'), req.param('role'), function(err,res){
            if(err){ next(err) }
            else{response.send(200,{error:null});}
          })
        }
      }
    }
  })
}

module.exports = User;