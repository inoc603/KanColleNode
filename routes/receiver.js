var express = require('express')
  , http = require('http')
  , Admiral = require('../lib/admiral')
  , querystring = require('querystring')
  , config = require('../lib/config')
  , _ = require('underscore')
  , io = null
  , dataHandler = null
  , router = express.Router()
  , adFinder = new Admiral('finder')
  , globals = require('../lib/globals')

router.post('/*', function (req, res) {
  var formData = req.body
    , reqBody = querystring.parse(formData.param)
    , token = reqBody.api_token
    , url = formData.url.split('/kcsapi')[1]
    , ad = ( adFinder.findByToken(token)
           ? adFinder.findByToken(token)
           : new Admiral(token))
  dataHandler.process(reqBody, formData.data, url, ad)
  res.send('OK')
})

module.exports = function (socket) {
  io = socket
  dataHandler = require('../lib/data-handler')(io)
  globals.dataHandler = dataHandler
  dataHandler.init()
  return router
}
