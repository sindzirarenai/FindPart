Spare = require('./controllers/spare'),
 spare = new Spare();

module.exports = function(app) {

  app.get('/', function(req,res, next){
    spare.index(req,res);
  });

  app.get('/filter', function(req,res,next){
    spare.filter(req, res);
  });
  
  app.get('/search', function(req,res,next){
    spare.search(req, res);
  });
  
 /* app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.post('/logout', require('./logout').post);

  app.get('/chat', checkAuth, require('./chat').get);*/

};
