var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , updateShips = function () {}

function updatePort (req, data, admiral) {
  _portBasic(data['api_basic'], admiral)
  _portMaterial(data['api_material'], admiral)
  async.series([ updateShips(req, data['api_ship'], admiral)
               , _portFleet(data['api_deck_port'], admiral)
               , updateRepair(req, data['api_ndock'], admiral)
               ])
  // clear battle panel
  if (admiral.client)
    io.to(admiral.client).emit('clear_battle')
  else
    io.emit('clear_battle')
}

function _portBasic (data, admiral) {
  var send = {}
    , newKeyForBasic = { 'api_level' : 'level'
                       , 'api_rank' : 'rank'
                       , 'api_experience' : 'exp'
                       , 'api_max_chara' : 'max_ship'
                       , 'api_max_slotitem' : 'max_equipment'
                       , 'api_count_deck' : 'fleet_count'
                       , 'api_count_ndock' : 'repair_dock_count'
                       , 'api_count_kdock' : 'build_dock_count'
                       , 'api_nickname' : 'name'
                       }

  for (key in newKeyForBasic)
    send[newKeyForBasic[key]] = data[key]

  if (!admiral.memberId) {
    send['mix_id'] = data['api_member_id'] + data['api_nickname_id']
    admiral.memberId = data['api_member_id']
    admiral.nicknameId = data['api_nickname_id']
  }
    
  io.emit('basic_update', send)
}

function _portMaterial (data, admiral) {
  var send = {}
  for (i in data) {
    send[data[i]['api_id'].toString()] = data[i]['api_value']
  }
  if (admiral.client)
    io.to(admiral.client).emit('material_update', send)
  else
    io.emit('material_update', send)
}

function _portFleet (data, admiral) {
  admiral.fleets.length = 0
  for (var i in data) {
    var temp = {}
    temp['name'] = data[i]['api_name']
    ships = data[i]['api_ship']
    temp['ships'] = []

    for (var j in ships) {
      if (admiral.ships[ships[j]])
        temp['ships'].push(admiral.ships[ships[j]])
    }
    temp.mission = data[i]['api_mission']
    if (temp.mission[1] != 0)
      temp['mission_name'] = gameData.expeditions[temp.mission[1]].name
    admiral.fleets.push(temp)
  }

  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)
}

module.exports = function (socket) {
  io = socket
  updateRepair =require('./update-repair')(io)
  updateShips = require('./update-ships')(io)
  return updatePort
}
