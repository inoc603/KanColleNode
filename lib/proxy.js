var http = require('http')
  , config = require('./config')
  , request = require('request')
  , SocksHttpAgent = require('socks5-http-client/lib/Agent')
  , _ = require('underscore')
  , socks5 = require('socks5-client')
  , url = require('url')
  , net = require('net')
  , fs = require('fs')
  , mime = require('mime')
  , format = require('string-template')
  , normalize = require('header-case-normalizer')

function proxy(req, res, reqBody) {
  var option = {
    headers: _.omit(req.headers, ['proxy-connection'])
  , url: req.url
  , method: req.method
  }

  // option.headers.connection = 'close'
  if (reqBody.length > 0) option.body = reqBody

  var proxyConfig = config.get('proxy')

  if (!isLocal(req)) {
    console.log('external', req.url)
    switch (config.get('proxy-type')) {
      case 'socks5':
        option.agentClass = SocksHttpAgent
        option.agentOptions = {
          socksHost: 'localhost'
        , socksPort: 1080
        }
        break
      case 'http':
        option.proxy = 'http://'+proxyConfig
        break
      default:
        break
    }
  }
  else {
    console.log('internal')
  }


  if (isGameApi(req)) {
    var send = {}
    send.url = req.url
    send.param = reqBody
    request(option, function (err, response, body) {
      send.data = body
      sendToKCN(send)
      res.writeHead(response.statusCode, response.headers)
      res.end(body)
    })
  }
  else {
    request(option).on('error', function (err) {
      console.log(err)
    }).pipe(res)
  }
}

function sendToKCN(send) {
  request.post('http://127.0.0.1:3001/drop', {form: send}
              , function (err) {
    if (err) console.log(err)
  })
}

function serverCache(req, res, reqBody) {
  var filename = 'cache'+ url.parse(req.url).pathname
  fs.exists(filename, function (exists) {
    if (exists) {
      console.log('FOUND', filename)
      fs.readFile(filename, function (err, data) {
        if (err) {
          console.log(err)
          proxy(req, res, reqBody)
        }
        else {
          console.log('SERVRING CACHE', filename)
          res.writeHead(200, {
            'Content-Type': mime.lookup(filename)
          , 'Content-Length': data.length
          , 'Cache-Control': 'max-age=2592000, public'
          })
          res.end(data)
        }
      })
    }
    else {
      console.log('NOT FOUND', filename)
      proxy(req, res, reqBody)
    }
  })
}

function isGameContent(req) {
  return (url.parse(req.url).pathname.match(/^\/kcs\/\S*/))
}

function isGameApi(req) {
  return (url.parse(req.url).pathname.match(/^\/kcsapi\/\S*/))
}
function isLocal(req) {
  var locals = ['127.0.0.1', 'localhost', 'localhost.']
  console.log(url.parse(req.url).hostname)
  return _.contains(locals, url.parse(req.url).hostname)
}

var server = http.createServer(function (req, res) {
  var reqBody = new Buffer(0)

  req.on('data', function (data) {
    reqBody += data
  }).on('end', function () {
    if (isGameContent(req)) {
      serverCache(req, res, reqBody)
    }
    else {
      if (isGameApi(req)) {
        console.log('API FOUND')
        console.log(reqBody, req.url, req.headers)
      }
      proxy(req, res, reqBody)
    }
  })
})

function getHostPort(hostString) {
  var result = /^([^:]+)(:([0-9]+))?$/.exec( hostString )

  return { host: result[1], port: (result[2]?parseInt(result[3]):443)}
}

function chain(remote, client) {
  remote.on('data', function (data) {
    client.write(data)
  }).on('end', function () {
    client.end()
  }).on('error', function (err) {
    console.log(err)
  })

  client.on('data', function (data) {
    remote.write(data)
  }).on('end', function () {
    client.end()
  }).on('error', function (err) {
    console.log(err)
  })
}

// handle https request
server.on('connect', function (req, client, bodyhead) {
  switch (config.get('proxy-type')) {
    // http proxy
    case 'http':
      var remote = net.connect(getHostPort(config.get('proxy')), function () {
        var msg = format('CONNECT {url} HTTP/{httpVersion}\r\n{headers}\r\n', {
          url: req.url
        , httpVersion: req.httpVersion
        , headers: _.keys(req.headers).reduce(function (pv, cv) {
            pv.push(normalize(cv) + ':' + req.headers[cv])
            return pv
          }, []).join('\r\n') + '\r\n'
        })

        remote.write(msg)
        remote.write(bodyhead)
        chain(client, remote)
      })
      break
    // socks5 proxy
    case 'socks5':
      var remote = socks5.createConnection({
        socksHost: 'localhost'
      , socksPort: 1080
      , host: req.headers.host
      , port: 443
      })
      remote.on('connect', function () {
        client.write('HTTP/1.1 200 Connection Established\r\nConnection: close\r\n\r\n')
        remote.write(bodyhead)
        chain(client, remote)
      })
      break
    // direct connection
    default:
      var remote = net.connect(getHostPort(req.url), function () {
        remote.write(bodyhead)
        client.write( "HTTP/"+ req.httpVersion
                           + " 200 Connection established\r\n\r\n" )
        chain(client, remote)
      })
      break
    }
  }
)

module.exports = server
