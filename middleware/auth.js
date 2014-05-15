var User = require('../models/user');

function Auth(){};

Auth.prototype.getUser = function(req, res, next){
  req.user = res.locals.user = null;
  if(!req.session.user) return next();
  
  User.findUser(req.session.user, function(err,user){
    if(err) {next(err);
    }else{
      req.user =res.locals.user =  user;
      next();
    }
  })
}

Auth.prototype.checkAuth = function(req,res,next){
  if(!req.session.user){
    res.render('error',{title:'Error', status:401, message:'Unauthorized'});
    res.redirect('/');
  }else{
    next();
  }
}

Auth.prototype.checkAdmin = function(req,res,next){
  if(req.user.role!='admin'){
    res.render('error',{title:'Error', status:403, message:'Forbidden'});
    //res.redirect('/');
  }else{
    next();
  } 
}

module.exports = Auth;