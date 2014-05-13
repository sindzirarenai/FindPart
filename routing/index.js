Search = require('./controllers/search'),
 search= new Search();
Spare = require('./controllers/spare'),
  spare = new Spare();
User = require('./controllers/user'),
  user = new User();
Auth = require('../middleware/auth'),
  auth = new Auth();

module.exports = function(app) {

  app.get('/search', auth.checkAuth, function(req,res,next){
    search.index(req,res,next);
  });

  app.get('/search/filter', auth.checkAuth,function(req,res,next){
    search.filter(req, res,next);
  });
  
  app.get('/search/find',auth.checkAuth,function(req,res,next){
    search.find(req, res,next);
  });
  
  app.get('/search/spare/:id',auth.checkAuth,function(req,res,next){
    spare.index(req,res,next);
  })
  
  app.get('/', function(req,res,next){
    user.logIn(req,res,next);
  })
  
  app.post('/', function(req,res,next){
    user.enter(req,res,next);
  })
  
  app.post('/logout',auth.checkAuth, function(req,res, next){
    user.logOut(req,res,next);
  })
  
  app.get('/user', auth.checkAuth, function(req,res,next){
    user.index(req,res,next);
  })
  
  app.post('/user/add', auth.checkAuth, function (req, res, next){
    user.addUser(req, res, next);
  })
  
};
