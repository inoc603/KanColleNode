var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');
var debug = require('debug')('KanColleNode:server');
var http = require('http');
var events = require('events');

var fs = require('fs');



var app = express();


// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
var server = http.createServer(app);

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('connected');
	// socket.emit('news', { hello: 'world' });

  socket.on('test', function (data) {
    // console.log(data);
    console.log('test: ', data);
    // socket.emit('test_good', {message: 'bar'});
    socket.join(data.message);
    io.to(data.message).emit('test_good');
  });

  socket.on('disconnect', function () {
    console.log('disconnect');
  })
});

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

// Event listener for HTTP server "listening" event.
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.text({type: '*/*'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers setup
var viewRoute = require('./routes/index');
var kcsapiRoute = require('./routes/kcsapi')(io);
app.use('/', viewRoute);
app.use('/kcsapi', kcsapiRoute);

// function isEmptyObject(obj) {
//   return !Object.keys(obj).length;
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
  // log the error, treat it like a 500 internal server error
  // maybe also log the request so you have more debug information
  // log.error(err, req);
 
  // during development you may want to print 
  // the errors to your console
  console.log(err.stack);
 
  // send back a 500 with a generic message
  res.status(500);
  res.send('oops! something broke');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
