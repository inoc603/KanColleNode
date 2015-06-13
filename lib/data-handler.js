var dataHandler = new Object()
  , handlers = {}
  // , io = null
  , io = require('./globals').io
  , gameData = require('./game-data')
  , fs = require('fs')
  , querystring = require('querystring')
  , _ = require('underscore')
  , events = require('events')

dataHandler.emitter = new events.EventEmitter

dataHandler.process = function (reqBody, rawBody, api, admiral) {
  try {
    var resJson = querystring.parse(rawBody)
    if (resJson.svdata) {
      var resData = JSON.parse(resJson.svdata)
      if (resData.api_result == 1) {
        dataHandler.emitter.emit(api, reqBody, resData.api_data, admiral)
        if (api in handlers)
          handlers[api](reqBody, resData.api_data, admiral)
        else
          console.log('no handler for', api)
      }

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

dataHandler.init = function () {
  var modules = fs.readdirSync('./lib/api-handlers')
  // load the api handlers
  for (var i in modules) {
    handlerModule = require('./api-handlers/' + modules[i])
    if (handlerModule.handler)
      for (var j in handlerModule.api)
        handlers[handlerModule.api[j]] = handlerModule.handler(io)
  }

  var newModules = fs.readdirSync('./lib/new-modules')
  // console.log(newModules)
  for (var m of newModules) {
    // console.log(m, 'new', require('./new-modules/' + m))
    require('./new-modules/' + m)
  }
}

module.exports = function (socket) {
  // io = socket
  // var modules = fs.readdirSync('./lib/api-handlers')
  // load the api handlers
  // for (var i in modules) {
  //   handlerModule = require('./api-handlers/' + modules[i])
  //   if (handlerModule.handler)
  //     for (var j in handlerModule.api)
  //       handlers[handlerModule.api[j]] = handlerModule.handler(io)
  // }

  // var newModules = fs.readdirSync('./lib/new-modules')
  // console.log(newModules)
  // for (var m of newModules) {
  //   console.log(m, 'new', require('./new-modules/' + m))
  //   // require('./new-modules/' + module)(io)
  // }

  return dataHandler
}
