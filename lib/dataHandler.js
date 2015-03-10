var dataHandler = new Object()

  , handlers = { '/api_port/port' : updatePort
               // , '/api_get_member/basic' : startBasic
               , '/api_start2' : gameInit
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
      if (api in handlers)
        // invoke the handler
        handlers[api](bodyJson['api_data'], admiral)
      else
        console.log('no handler for api')
    else
      console.log('kancolle server error')
  }
  else
    console.log('wrong data content')
}

function updatePort (data, admiral) {
  _portBasic(data['api_basic'], admiral)
  _portMaterial(data['api_material'], admiral)
  _portShip(data['api_ship'], admiral)
  _portFleet(data['api_deck_port'], admiral)

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

function _portShip (data, admiral) {
  var send = { 'current_ship' : data.length}
    , newHeader = { 'api_fuel': 'fuel'
                  , 'api_locked_equip': 'equipment_locked'
                  , 'api_lv': 'level'
                  , 'api_locked': 'locked'
                  , 'api_leng': 'range'
                  , 'api_kaihi': 'evasion'
                  , 'api_ndock_time': 'repair_time'
                  , 'api_slotnum': 'slot_number'
                  , 'api_taisen': 'anti_submarine'
                  , 'api_id': 'id'
                  , 'api_ndock_item': 'repair_cost'
                  , 'api_soukou': 'armor'
                  , 'api_karyoku': 'firepower'
                  , 'api_onslot': 'capacity'
                  , 'api_nowhp': 'current_hp'
                  , 'api_exp': 'exp'
                  , 'api_slot': 'equipment'
                  , 'api_raisou': 'tropedo'
                  , 'api_backs': 'backs'
                  , 'api_srate': 'rarity'
                  , 'api_ship_id': 'ship_id'
                  , 'api_bull': 'ammo'
                  , 'api_sakuteki': 'tracking'
                  , 'api_sortno': 'sort_id'
                  , 'api_taiku': 'anti_air'
                  , 'api_maxhp': 'max_hp'
                  , 'api_kyouka': 'power_up'
                  , 'api_cond': 'condition'
                  , 'api_lucky': 'luck'
                  }

  if (admiral.client)
    io.to(admiral.client).emit('basic_update', send)
  else
    io.emit('basic_update', send)

  var tempShipList = {}
  for (var i in data) {
    var tempShip = new Object()
    for (var j in data[i])
      tempShip[newHeader[j]] = data[i][j]
    tempShip['name'] = gameData.shipName[tempShip['ship_id']]
    id = tempShip['id']
    delete tempShip['id']
    tempShipList[id] = tempShip 
  }

  admiral.ships = tempShipList
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
    temp['mission'] = data[i]['api_mission']
    admiral.fleets.push(temp)
  }
  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)
}

function startBasic (data, admiral) {
  
}

function gameInit (data, admiral) {
  _masterShip(data['api_mst_ship'])
}

function _masterShip (data) {
  gameData.shipName = {}
  for (var i in data) {
    gameData.shipName[data[i]['api_id']] = data[i]['api_name']
  }
  // console.log(gameData.shipName)
  gameData.storeShipNames()
}

module.exports = function (socket) {
  io = socket
  return dataHandler
}