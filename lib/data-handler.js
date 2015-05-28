var dataHandler = new Object()
  , handlers = {}
  , io = null
  , gameData = require('./game-data')
  , fs = require('fs')
  , querystring = require('querystring')
  , _ = require('underscore')

dataHandler.process = function (reqBody, rawBody, api, admiral) {
  try {
    var resJson = querystring.parse(rawBody)
    if (resJson.svdata) {
      var resData = JSON.parse(resJson.svdata)
      if (resData.api_result == 1)
        if (api in handlers)
          handlers[api](reqBody, resData.api_data, admiral)
        else
          console.log('no handler for', api)
      else
        console.log('kancolle server error')
    }
    else
      console.log('wrong data content')
  }
  catch (e) {
    console.log(e)
  }
}

module.exports = function (socket) {
  io = socket
  var modules = fs.readdirSync('./lib/api-handlers')
  // load the api handlers
  for (var i in modules) {
    handlerModule = require('./api-handlers/' + modules[i])
    if (handlerModule.handler)
      for (var j in handlerModule.api)
        handlers[handlerModule.api[j]] = handlerModule.handler(io)
  }

  return dataHandler
}
