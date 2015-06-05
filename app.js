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
  , simpleProxy

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

fs.exists('admiral', function (exists) {
  if (!exists)
    fs.mkdir('admiral', function (err) {
      if (err) console.log(err)
    })
})


var app = express()

// Get port from environment and store in Express.
var port = normalizePort(process.env.PORT || config.config.port)
app.set('port', port)

// Create HTTP server.
var httpServer = http.createServer(app)

// socket.io used to push
var io = require('./lib/socketio')(httpServer)

// Listen on provided port, on all network interfaces.
httpServer.listen(port, 'localhost')

var regex_hostport = /^([^:]+)(:([0-9]+))?$/

function getHostPortFromString( hostString, defaultPort ) {
  var host = hostString
  var port = defaultPort

  var result = regex_hostport.exec( hostString )
  if ( result != null ) {
    host = result[1]
    if ( result[2] != null ) {
      port = result[3]
    }
  }

  return( [ host, port ] )
}
// add connect listener to the server so it can handle https proxy requests
httpServer.addListener('connect', function (req, socketRequest, bodyhead) {
    var url = req.url
      , httpVersion = req.httpVersion
      , pHost
      , pPort

    //
    if (simpleProxy) {
      pHost = proxyHost
      pPort = proxyPort

    }
    else {
      var hostport = getHostPortFromString( url, 443 )
      pHost = hostport[0]
      pPort = parseInt( hostport[1] )
    }

    // set up tcp connection with the server
    var proxySocket = net.connect(pPort, pHost, function () {
      proxySocket.write(bodyhead)
      // tell the caller the connection was successfully established
      socketRequest.write( "HTTP/"+ httpVersion
                         + " 200 Connection established\r\n\r\n" )
      socketRequest.pipe(proxySocket).pipe(socketRequest)
      }
    )

    proxySocket.on('error', function (err) {
      console.log(err)
    })

    socketRequest.on('error', function (err) {
      console.log(err)
    })
  }
)
httpServer.on('error', onError)
httpServer.on('listening', onListening)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.enable('trust proxy')

app.use(bodyParser({limit: '50mb'}))
app.use(bodyParser.text({type: '*/*'}))
app.use(cookieParser())
app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'public')))

// Routers setup
var viewRoute = require('./routes/index')
  , restRoute = require('./routes/rest')
  , receiverRoute = require('./routes/receiver')(io)
  , proxyRoute = require('./routes/proxy')

app.use('/drop', receiverRoute)
app.use('*', proxyRoute)
app.use('/rest', restRoute)
app.use('/', viewRoute)

var modules = fs.readdirSync('./plugins')
// load the api handlers
for (var i in modules) {
  require('./plugins/' + modules[i])(io)
}



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
