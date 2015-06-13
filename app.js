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
  , globals = require('./lib/globals')
  , io = globals.io
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

app.set('port', (config.config.port? config.config.port: 3001))

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
app.use('/drop', require('./routes/receiver')(io))
app.use('*', require('./routes/proxy'))
app.use('/rest', require('./routes/rest'))
app.use('/', require('./routes/index'))

var plugins = fs.readdirSync('./plugins')
  , regJs = /.*\.js$/

plugins = plugins.reduce(function (pv, cv) {
  if (regJs.test(cv)) pv.push(cv)
  return pv
}, [])
// load the api handlers
for (var i in plugins) {
  require('./plugins/' + plugins[i])(io)
}

// app.use(favicon(__dirname + '/public/favicon.ico'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // filter out requsets for socket.io reach here by accident
  if (req.url.indexOf('/socket.io/?') != -1) return
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  if (req.url.indexOf('/socket.io/?') != -1) return
  console.log(err.stack)
  res.status(500)
  res.send('oops! something broke')
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (req.url.indexOf('/socket.io/?') != -1) return
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
  if (req.url.indexOf('/socket.io/?') != -1) return
  console.log(err)
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
