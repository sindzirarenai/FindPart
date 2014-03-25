var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./lib/log');
var express = require('express');
var app = express();

//set all 'options'
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
if (app.get('env')=='development'){
	app.use(express.logger('dev'));
} else {
	app.use(express.logger('default'));
}
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
//app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//error handler
app.use( function (err,req,res, next){
	if ('development' == app.get('env')) {
		var erHandler = express.errorHandler();
		erHandler(err, req, res, next);
	} else{
		res.send(500);
	}
});

//create server
http.createServer(app).listen(
	config.get('server:port'),
	function(){
		console.log('Express server listening on port ' + config.get('server:port') )
});



var routes = require('./routes');
var user = require('./routes/user');

//development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
/*app.get('/users', user.list);*/



