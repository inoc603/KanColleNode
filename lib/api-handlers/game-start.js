var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , replacement = {}

replacement['equipment'] = { "api_id": 'id'
                           , "api_houg": 'firepower'
                           , "api_leng": 'range'
                           , "api_houk": 'evasion'
                           , "api_raig": 'tropedo'
                           , "api_houm": 'accuracy'
                           , "api_tyku": 'anti_air'
                           , "api_souk": 'armor'
                           , "api_saku": 'tracking'
                           , "api_name": 'name'
                           , "api_luck": 'luck'
                           , "api_tais": 'anti_submarine'
                           , "api_baku": 'bomb'
                           , 'api_type': 'type'
                           }

replacement['ships'] = { 'api_name': 'name'
                       , 'api_stype': 'type'
                       , 'api_yomi': 'yomi'
                       , 'api_afterlv': 'afterlv'
                       , 'api_id': 'id'
                       }

replacement['shipTypes'] = { 'api_name': 'name'
                           , 'api_id': 'id'
                           }
                           
replacement['expeditions'] = { 'api_name': 'name'
                             , 'api_id': 'id'
                             }                

function gameStart (req, data, admiral) {
  loadMaster('ships', data['api_mst_ship'])
  loadMaster('shipTypes', data['api_mst_stype'])
  loadMaster('expeditions', data['api_mst_mission'])
  loadMaster('equipment', data['api_mst_slotitem'])
}

function loadMaster (category, data) {
  gameData[category] = {}
  var newKey = replacement[category]
  for (var i in data) {
    var temp = {}
    for (var key in newKey)
      temp[newKey[key]] = data[i][key]
    gameData[category][data[i]['api_id']] = temp
  }
  gameData.store(category)
}

module.exports = function (socket) {
  io = socket
  return gameStart
}
