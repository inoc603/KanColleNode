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
  // console.log(req.body)
  // var formData = querystring.parse(req.body)
  // console.log(formData)
  var formData = req.body
  // console.log(_.keys(formData))
  var reqBody = querystring.parse(formData.param)
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
  return router
}
