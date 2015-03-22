var express = require('express')
  , http = require('http')
  , Admiral = require('../lib/admiral')
  , querystring = require('querystring')

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
  option.path = req._parsedUrl.pathname
  option.headers = req.headers
  option.headers.host = option.headers.host.replace('localhost.'
    , '127.0.0.1')
  option.method = req.method

  // replace the lowercase header keys with case-sesitive ones
  // in order to be recognized by the KanColle server.
  var hkeys = Object.keys(option.headers)
  for (var i = 0; i < sensitive.length; i++) {
    j = hkeys.indexOf(sensitive[i].toLowerCase())
    if (j != -1)
      hkeys[j] = sensitive[i]
  }
  for (var i = 0; i < hkeys.length; i++) {
    option.headers[hkeys[i]] = 
      option.headers[hkeys[i].toLowerCase()]
    delete option.headers[hkeys[i].toLowerCase()]
  }

  var proxyRes = http.request(option);

  proxyRes
    .on('response', function (resp) {
      resp.pipe(res, {end:true})
      resp.body = ""
      resp.on('data', function (chunk) {
        resp.body += chunk
      })
      resp.on('end', function () {
        // parse request body
        reqBody = querystring.parse(req.body)
        
        // send the response data to dataHandler module
        token = reqBody.api_token
        if (adFinder.findByToken(token)) 
          ad = adFinder.findByToken(token)
        else
          ad = new Admiral(token)

        delete reqBody.api_token
        delete reqBody.api_verno
        console.log(reqBody)
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
  dataHandler = require('../lib/dataHandler')(io);
  return router;
};