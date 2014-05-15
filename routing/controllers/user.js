var UserModel = require('../../models/user');
Validator = require('../../lib/validate'),
  validator = new Validator();

function User(){
}

User.prototype.logIn = function(req, response, next){
  response.render('index',{title:'FindSparePart'});
  return true;
}

User.prototype.index = function(req,response,next){
  response.render('user',{title:'Личный кабинет', users:null, activeLink:'profile'});
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
  response.end();
  return true;
}

User.prototype.addUser = function(req,response, next){
  validator.validateUser(req.param('username'),req.param('password'),req.param('passwordRepeat'),
  function(err,errors){
    if(err){next(err);}
    else{
      if (!errors){
        UserModel.addUser(req.param('username'),req.param('password'),req.param('role'),
        function(err,res){
          if(err){next(err);}
          else{response.send(null)}
        })
      }else{
        response.send(errors);
      }
    }
  })
  return true;
}

User.prototype.profile = function(req,response,next){
  response.render('user',{title:'Личный кабинет', users:null, activeLink:'profile'});   
}

User.prototype.manager = function(req,response,next){
  UserModel.find({},function(err,res){
    if(err){ next(err);}
    else{
      response.render('user',{title:'Личный кабинет', users:res, activeLink:'manager'});   
    }
  })
}

User.prototype.settings= function(req,response,next){
  response.render('user',{title:'Личный кабинет', users:null, activeLink:'settings'});   
}

module.exports = User;