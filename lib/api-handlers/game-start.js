var io = null
  , gameData = require('../gameData')
  , async = require('async')

function startBasic (data, admiral) {
  
}

function gameStart (req, data, admiral) {
  _masterShip(data['api_mst_ship'])
  _masterShipType(data['api_mst_stype'])
  _masterMission(data['api_mst_mission'])
}

function _masterShip (data) {
  gameData.ships = {}
  for (var i in data) {
    gameData.ships[data[i]['api_id']] = {}
    gameData.ships[data[i]['api_id']].name = data[i]['api_name']
    gameData.ships[data[i]['api_id']].type = data[i]['api_stype']
  }
  gameData.store('ships')
}

function _masterShipType (data) {
  gameData.shipType = {}
  for (var i in data) {
    gameData.shipTypes[data[i]['api_id']] = {}
    gameData.shipTypes[data[i]['api_id']].name = data[i]['api_name']
  }
  gameData.store('shipTypes')
}

function _masterMission (data) {
  gameData.expeditions = {}
  for (var i in data) {
    gameData.expeditions[data[i].api_id] = {}
    temp = gameData.expeditions[data[i].api_id]
    temp.name = data[i].api_name
  }
  gameData.store('expeditions')
  console.log(gameData.expeditions)
}

module.exports = function (socket) {
  io = socket
  return gameStart
}
