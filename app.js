var express = require('express')
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log')(module);
var routing = require('./routing');
var mongoose = require ('./lib/db');
var Auth = require('./middleware/auth');
var app = express();
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.favicon()); // /favicon.ico
if (app.get('env') == 'development') {
  app.use(express.logger('dev'));
} else {
  app.use(express.logger('default'));
}

app.use(express.bodyParser());  // req.body....

app.use(express.cookieParser()); // req.cookies

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
  secret:config.get("session:secret"),
  key:config.get("session:key"),
  cookie:config.get("session:cookie"),
  store: new MongoStore({db:"findSpare"})  
}));

var auth = new Auth();
app.use(auth.getUser);

app.use(app.router);
routing(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res){
  log.error('Page not found: '+req.url);
  res.render('error', {title:'Error', status:404,message:'Page not found'});
})

app.use(function(err, req, res, next) {
  log.error('Error in server: '+req.url);
  if (app.get('env') == 'development'||'production') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.render('error', {title:"Error" ,status:500,message:'Internal server error'});
  }
});


http.createServer(app).listen(config.get('server:port'), function(){
  console.log('Express server listening on port ' + config.get('server:port'));
  log.info('Express server listening on port ' + config.get('server:port'));
});
