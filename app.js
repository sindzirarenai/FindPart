var express = require('express')
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log');
var routing = require('./routing');

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

app.use(app.router);
routing(app);

app.use(express.static(path.join(__dirname, 'public')));


app.use(function(err, req, res, next) {
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

http.createServer(app).listen(config.get('server:port'), function(){
  console.log('Express server listening on port ' + config.get('server:port'));
  log.info('Express server listening on port ' + config.get('server:port'));
});
