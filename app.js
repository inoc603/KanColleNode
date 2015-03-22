var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , debug = require('debug')('KanColleNode:server')
  , http = require('http')
  // , https = require('https')
  , request = require('request')
  , events = require('events')
  , fs = require('fs')

var app = express();

var proxy = 'http://127.0.0.1:8099'


// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server.
var httpServer = http.createServer(app);

// HTTPS server
// var privateKey = fs.readFileSync('./cert/key.pem', 'utf8').toString();
// var certificate = fs.readFileSync('./cert/server.crt', 'utf8').toString(); 
// var httpsServer = https.createServer({key:privateKey, cert:certificate}, app)

// socket.io used to push
var io = require('./lib/socketio')(httpServer);

// Listen on provided port, on all network interfaces.
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.enable('trust proxy')

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.text({type: '*/*'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers setup
var viewRoute = require('./routes/index')
  , kcsapiRoute = require('./routes/kcsapi')(io)

// app.all('*', function (req, res, next) {
//   var parsedUrl = req._parsedUrl
//     , localList = [ 'localhost'
//                   , 'localhost.'
//                   , '127.0.0.1'
//                   ]
//   if (localList.indexOf(parsedUrl.hostname) != -1) {
//     next()
//   }
//   else {
//     console.log('proxy ' + parsedUrl._raw)
//     option = {'url': parsedUrl._raw}
//     if (typeof proxy != 'undefined')
//       option.proxy = proxy
//     console.log(option.url)
//     req.pipe(request(option)).pipe(res)
//   }
// })
app.use('/', viewRoute)
app.use('/kcsapi', kcsapiRoute)

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
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

  
module.exports = app;
