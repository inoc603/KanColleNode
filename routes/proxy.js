var express = require('express')
  , http = require('http')
  , Admiral = require('../lib/admiral')
  , querystring = require('querystring')
  , config = require('../lib/config')
  , _ = require('underscore')
  , router = express.Router()
  , adFinder = new Admiral('finder')
  , request = require('request')

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

  if (isLocal && isRightPort && req.baseUrl != '/socket.io') {
    // console.log(req.body)
    next()
  }
  else {
    var option = {}
    option.url = req.originalUrl.replace('localhost.', '127.0.0.1')
    option.method = req.method
    // option.headers = {}
    // for (var i = 0; i < req.rawHeaders.length; i+=2) {
    //   option.headers[req.rawHeaders[i]] = req.rawHeaders[i+1]
    // }

    // if (option.headers['Host'])
    //   option.headers['Host']
    //     = option.headers['Host'].replace('localhost.', '127.0.0.1')
    option.headers = req.headers
    option.body = (req.body).toString()

    if (config.config.proxy && !isLocal) {
      option.proxy = 'http://'+ config.config.proxy
    }

    request(option)
      .on('error', function (err) {
        // console.log(req.method, req.rawHeaders)
        console.log('proxy error', req.url, err)
      })
      .pipe(res)
  }
})

module.exports = router
