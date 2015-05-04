var dataHandler = new Object()
  , handlers = {}
  , io = null
  , gameData = require('./game-data')
  , fs = require('fs')

dataHandler.process = function (reqBody, rawBody, api, admiral) {
  // check if the response body is valid
  if (rawBody.slice(0, 7) == 'svdata=') {
    var bodyJson = JSON.parse(rawBody.slice(7))
    // check if result is normal
    if (bodyJson['api_result'] = 1)
      // check if there's a handler for the api
      if (api in handlers) {
        // invoke the handler
        handlers[api](reqBody, bodyJson['api_data'], admiral)
      }
      else
        console.log('no handler for api')
    else
      console.log('kancolle server error')
  }
  else
    console.log('wrong data content', rawBody)
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