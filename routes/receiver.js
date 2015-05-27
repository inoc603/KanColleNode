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

router.post('/*', function (req, res) {
  var formData = req.body
    , reqBody = querystring.parse(formData.param)
    , token = reqBody.api_token
    , url = formData.url.split('/kcsapi')[1]
    , ad = ( adFinder.findByToken(token)
           ? adFinder.findByToken(token)
           : new Admiral(token))
  console.log(_.keys(formData), formData.url, formData.param)
  dataHandler.process(reqBody, formData.data, url, ad)
  res.send('OK')
})

module.exports = function (socket) {
  io = socket
  dataHandler = require('../lib/data-handler')(io)
  return router
}
