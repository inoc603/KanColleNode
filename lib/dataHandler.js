var dataHandler = new Object()
  , handlers = {}
  , io = null
  , gameData = require('./gameData')
  , fs = require('fs')

  , apiToModule = { '/api_port/port': 'update-port'
                  , '/api_start2': 'game-start'
                  , '/api_req_hensei/change': 'fleet-change'
                  , '/api_get_member/ndock': 'update-repair'
                  , '/api_get_member/kdock': 'update-build'
                  , '/api_req_kousyou/getship': 'get-created-ship'
                  }

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
    console.log('wrong data content')
}




module.exports = function (socket) {
  io = socket
  // handlers['/api_port/port'] =
  //   require('./api-handlers/update-port')(io)
  // handlers['/api_start2'] =
  //   require('./api-handlers/game-start')(io)
  // handlers['/api_req_hensei/change'] =
  //   require('./api-handlers/fleet-change')(io)
  // handlers['/api_get_member/ndock'] =
  //   require('./api-handlers/update-repair')(io)
  // handlers['/api_get_member/kdock'] = 
  //   require('./api-handlers/update-build')(io)
  for (var api in apiToModule) {
    handlers[api] = require('./api-handlers/'+apiToModule[api])(io)
  }
    
  return dataHandler
}