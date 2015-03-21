var io = null
  , gameData = require('../gameData')
  , async = require('async')

function startBasic (data, admiral) {
  
}

function gameStart (data, admiral) {
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
  return gameStart
}
