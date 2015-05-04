var express = require('express')
  , http = require('http')
  , Admiral = require('../lib/admiral')
  , querystring = require('querystring')
  , config = require('../lib/config')

var io = null
  , dataHandler = null
  , router = express.Router()
  , adFinder = new Admiral('finder')

// headers need to be changed into case-sensitive ones
  , sensitive = [ 'Second-Send-Url', 'Accept', 'Accept-Language'
                , 'User-Agent', 'Host', 'Content-Type'
                , 'X-Requested-With', 'Origin', 'Referer'
                , 'Content-Length', 'Accept-Encoding'
                ]

router.all('/*', function (req, res) {
  // Construct options for proxy request
  var option = {}
  option.hostname = req.hostname.replace('localhost.', '127.0.0.1')
  option.port = req._parsedUrl.port
  option.path = req.baseUrl + req._parsedUrl.pathname

  option.method = req.method
  option.headers = {}
  for (var i = 0; i < req.rawHeaders.length; i+=2) {
    option.headers[req.rawHeaders[i]] = req.rawHeaders[i+1]
  }
  option.headers['Host']
    = option.headers['Host'].replace('localhost.', '127.0.0.1')

  if (config.config.proxy)
    option.proxy = config.config.proxy

  // console.log(req)

  var proxyRes = http.request(option)

  proxyRes
    .on('response', function (resp) {
      resp.pipe(res, {end:true})
      resp.body = ""
      resp.on('data', function (chunk) {
        resp.body += chunk
      })
      resp.on('end', function () {
        // parse request body
        var reqBody = querystring.parse(req.body)
        
        // find admiral for the request
        var token = reqBody.api_token
        if (adFinder.findByToken(token)) 
          ad = adFinder.findByToken(token)
        else
          ad = new Admiral(token)

        delete reqBody.api_token
        delete reqBody.api_verno
        console.log(reqBody)
        // send the response data to dataHandler module
        dataHandler.process(reqBody, resp.body, req._parsedUrl.pathname, ad)
      })
    })
    .on('error', function (err) {
      console.log(err)
    })

  proxyRes.write(req.body);
  proxyRes.end();

});

module.exports = function (socket) {
  io = socket;
  dataHandler = require('../lib/data-handler')(io);
  return router;
};