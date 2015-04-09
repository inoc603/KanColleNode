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
                  , '/api_req_sortie/battle': 'get-battle'
                  , '/api_req_battle_midnight/battle': 'get-night-battle'
                  , '/api_req_map/start': 'map-start'
                  , '/api_req_map/next': 'map-next'
                  , '/api_req_sortie/battleresult': 'battle-result'
                  , '/api_get_member/ship2': 'get-ships2'
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
    console.log('wrong data content', rawBody)
}




module.exports = function (socket) {
  io = socket

  for (var api in apiToModule) {
    handlers[api] = require('./api-handlers/'+apiToModule[api])(io)
  }
    
  return dataHandler
}