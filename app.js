var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , debug = require('debug')('KanColleNode:server')
  , http = require('http')
  , request = require('request')
  , events = require('events')
  , fs = require('fs')
  , config = require('./lib/config')
  , os = require('os')
  , ifaces = os.networkInterfaces()

  , net = require('net')

var IP_ADDR = []
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return
    }

    IP_ADDR.push(iface.address)
  })
})
console.log('IP:', IP_ADDR, 'PORT', config.config.port)


var app = express()

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || config.config.port)
app.set('port', port)

// Create HTTP server.
var httpServer = http.createServer(app)
// var httpServer = net.createServer(app)

// socket.io used to push
var io = require('./lib/socketio')(httpServer)

// Listen on provided port, on all network interfaces.
httpServer.listen(port)
httpServer.on('error', onError)
httpServer.on('listening', onListening)

/* maybe handle connect event here?
var debugging = 0
var regex_hostport = /^([^:]+)(:([0-9]+))?$/;
function getHostPortFromString( hostString, defaultPort ) {
  var host = hostString;
  var port = defaultPort;

  var result = regex_hostport.exec( hostString );
  if ( result != null ) {
    host = result[1];
    if ( result[2] != null ) {
      port = result[3];
    }
  }

  return( [ host, port ] );
}
httpServer.on('connect', function ( req, resSocket, bodyhead ) {
  // console.log(req.upgrade)
  var url = req.url;
  var httpVersion = req.httpVersion;

  var hostport = getHostPortFromString( url, 443 );

  if ( debugging )
    console.log( '  = will connect to %s:%s', hostport[0], hostport[1] );

  // set up TCP connection
  var proxySocket = new net.Socket();
  proxySocket.connect(
    parseInt( hostport[1] )
    , hostport[0]
    // 8099
    // , '127.0.0.1'
    // 8099, 'localhost',
    , function () {
      if ( debugging )
        console.log( '  < connected to %s/%s', hostport[0], hostport[1] );

      if ( debugging )
        console.log( '  > writing head of length %d', bodyhead.length );

      var headers = ''
      for (var i=0; i<req.rawHeaders.length; i++) {
        if (i%2==0)
          headers+=req.rawHeaders[i]
        else
          headers+=':'+req.rawHeaders[i]+'\r\n'
      }

      // console.log(req.method
      //                  + ' ' + req.url
      //                  + ' HTTP/' + req.httpVersion + '\r\n'
      //                  + headers + '\r\n'
      //                  + bodyhead.toString())

      // proxySocket.write( req.method
      //                  + ' ' + req.url
      //                  + ' HTTP/' + req.httpVersion + '\r\n'
      //                  + headers + '\r\n'
      //                  + bodyhead.toString())
      proxySocket.write( bodyhead )

      // tell the caller the connection was successfully established
      resSocket.write( "HTTP/" + httpVersion
               + " 200 Connection established\r\n\r\n");
    }
  );
  proxySocket.pipe(resSocket).pipe(proxySocket)
  proxySocket.on('error', function (err) {
    console.log(err)
  })
  // var data = new Buffer('')
  // proxySocket.on('data', function (chunk) {
  //   data+=chunk
  // })
  // proxySocket.on('end', function (chunk) {
  //   // console.log(data.toString())
  //   var str = data.toString()
  //   console.log(str, str.length)
  //   data = new Buffer('')
  // })
  resSocket.on('error', function (err) {
    console.log(err)
  })
})

*/

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.enable('trust proxy')


app.use(bodyParser.text({type: '*/*'}))
app.use(cookieParser())
app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'public')))

// Routers setup
var viewRoute = require('./routes/index')
  , kcsapiRoute = require('./routes/kcsapi')(io)
  , restRoute = require('./routes/rest')
  ,receiverRoute = require('./routes/receiver')(io)

app.use('/drop', receiverRoute)
app.use('/kcsapi', kcsapiRoute)
app.use('*', function (req, res, next) {
  var isLocal = ( req.hostname == '127.0.0.1' ||
                  req.hostname == 'localhost' ||
                  req.hostname == 'localhost.'||
                  IP_ADDR.indexOf(req.hostname) != -1
                )
    , isRightPort = (req.headers.host.split(':')[1]==config.config.port)

  if (isLocal && isRightPort && req.baseUrl != '/socket.io') {
    console.log(req.body)
    next()
  }
  else {
    var option = {}
    option.url = req.originalUrl.replace('localhost.', '127.0.0.1')
    option.method = req.method
    option.headers = {}
    for (var i = 0; i < req.rawHeaders.length; i+=2) {
      option.headers[req.rawHeaders[i]] = req.rawHeaders[i+1]
    }

    if (option.headers['Host'])
      option.headers['Host']
        = option.headers['Host'].replace('localhost.', '127.0.0.1')

    if (typeof req.body == 'string')
      option.body = req.body
    if (typeof req.body == 'object') {
      if (Object.keys(req.body).length > 0)
        option.body = JSON.stringify(req.body)
    }
    else {
      if (typeof req.body != 'string')
        console.log('new type', typeof req.body)
    }

    if (config.config.proxy)
      option.proxy = config.config.proxy

    request(option)
      .on('error', function (err) {
        console.log(req.method, req.rawHeaders)
        console.log('proxy error', err)
      })
      .pipe(res)
  }
})
app.use('/rest', restRoute)
app.use('/', viewRoute)



// app.use(favicon(__dirname + '/public/favicon.ico'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  // log the error, treat it like a 500 internal server error
  // maybe also log the request so you have more debug information
  // log.error(err, req)

  // during development you may want to print
  // the errors to your console
  console.log(err.stack)

  // send back a 500 with a generic message
  res.status(500)
  res.send('oops! something broke')
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = httpServer.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}


module.exports = app
