var express = require('express')
  , http = require('http')
  , Admiral = require('../lib/admiral')
  , querystring = require('querystring')
  , config = require('../lib/config')
  , _ = require('underscore')
  , router = express.Router()
  , adFinder = new Admiral('finder')
  , request = require('request')
  , SocksHttpAgent = require('socks5-http-client/lib/Agent')
  , socks5 = require('socks5-client')

  , os = require('os')
  , ifaces = os.networkInterfaces()

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

router.all('/*', function (req, res, next) {
  var isLocal = ( req.hostname == '127.0.0.1' ||
                  req.hostname == 'localhost' ||
                  req.hostname == 'localhost.'||
                  IP_ADDR.indexOf(req.hostname) != -1
                )
    , isRightPort = (req.headers.host.split(':')[1]==config.config.port)

  if (isLocal && isRightPort) {
    // console.log(req.body)
    next()
  }
  else {
    var option = {}
    option.url = req.originalUrl.replace('localhost.', '127.0.0.1')
    option.method = req.method
    option.headers = _.omit(req.headers, 'proxy-connection')
    option.headers.conection = 'close'
    
    if (_.isObject(req.body)) {
      console.log(_.keys(req.body).length)
      if (_.keys(req.body).length > 0)
        option.body = JSON.stringify(req.body)
    }
    else
      option.body = req.body

    if (config.config.proxy && !isLocal) {
      switch (config.get('proxy-type')) {
        case 'socks5':
          option.agentClass = SocksHttpAgent
          option.agentOptions = {
            socksHost: 'localhost'
          , socksPort: 1080
          }
          break
        case 'http':
          option.proxy = 'http://' + config.get('proxy')
          break
        default:
          break
      }
    }

    console.log(option)

    request(option)
      .on('error', function (err) {
        // console.log(req.method, req.rawHeaders)
        console.log('proxy error', req.url, err)
      })
      .pipe(res)
  }
})

function newProxyImplement(req, res, next) {
  if (util.toThisServer(req.hostname, req.port)) next()
  else {
    if (util.isGameContent(req.path)) {

    }
  }
}

module.exports = router
