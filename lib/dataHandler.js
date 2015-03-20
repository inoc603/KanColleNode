var dataHandler = new Object()
  , handlers = { 
               // , '/api_get_member/basic' : startBasic
               '/api_start2' : gameInit
               }
  , io = null
  , gameData = require('./gameData')
  , fs = require('fs')

dataHandler.process = function (rawBody, api, admiral) {
  // check if the response body is valid
  if (rawBody.slice(0, 7) == 'svdata=') {
    var bodyJson = JSON.parse(rawBody.slice(7))
    // check if result is normal
    if (bodyJson['api_result'] = 1)
      // check if there's a handler for the api
      if (api in handlers) {
        // invoke the handler
        handlers[api](bodyJson['api_data'], admiral)
      }
      else
        console.log('no handler for api')
    else
      console.log('kancolle server error')
  }
  else
    console.log('wrong data content')
}


function startBasic (data, admiral) {
  
}

function gameInit (data, admiral) {
  _masterShip(data['api_mst_ship'])
  _masterShipType(data['api_mst_stype'])
}

function _masterShip (data) {
  gameData.ships = {}
  for (var i in data) {
    gameData.ships[data[i]['api_id']] = {}
    gameData.ships[data[i]['api_id']].name = data[i]['api_name']
    gameData.ships[data[i]['api_id']].type = data[i]['api_stype']
  }
  gameData.storeShips()
}

function _masterShipType (data) {
  gameData.shipType = {}
  for (var i in data) {
    gameData.shipTypes[data[i]['api_id']] = {}
    gameData.shipTypes[data[i]['api_id']].name = data[i]['api_name']
  }
  gameData.storeShipTypes()
}

module.exports = function (socket) {
  io = socket
  handlers['/api_port/port'] = require('./api-handlers/update-port')(io)
  return dataHandler
}