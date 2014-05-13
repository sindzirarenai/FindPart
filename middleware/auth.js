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
    res.redirect('/');
  }
  next();
}

module.exports = Auth;