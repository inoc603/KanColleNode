var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , updateShips = function () {}
  , fs = require('fs')

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
  
  if (!fs.existsSync('admiral/'+admiral.memberId)) {
    fs.mkdirSync('admiral/'+admiral.memberId)
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
    temp.ships = []

    for (var j in ships) {
      if (admiral.ships[ships[j]])
        temp.ships.push(admiral.ships[ships[j]])
    }
    temp.mission = data[i]['api_mission']
    if (temp.mission[1] != 0)
      temp['mission_name'] = gameData.expeditions[temp.mission[1]].name

    if (!admiral.equipment) {
      admiral.equipment = JSON.parse(fs.readFileSync('admiral/'+admiral.memberId+'/equipment.json').toString())
    }
    // console.log(admiral.equipment)
    antiAirTotal = 0
    for (var j in temp.ships) {
      capacity = temp.ships[j].capacity
      equipment = temp.ships[j].equipment

      planes = [6, 7, 8, 9, 10, 11]
      
      // console.log(equipment)
      for (var k = 0; k < 5; k++) {

        // console.log(capacity[k])
        if (equipment[k] == -1) continue
        else {
          // console.log(equipment[k])
          // console.log(admiral.equipment[equipment[k]])
          item = gameData.equipment[admiral.equipment[equipment[k]].item_id]

          if (planes.indexOf(item.type[2])!=-1)
            antiAirTotal += Math.floor(Math.sqrt(capacity[k])*item.anti_air)
        }
      }
      
    }
    temp.anti_air = antiAirTotal
    // console.log(temp.anti_air)

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
