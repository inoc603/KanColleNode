var io = null
  , gameData = require('../game-data')

function updateShips (req, data, admiral) {
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
    var tempShip = {}

    for (var j in data[i])
      tempShip[newHeader[j]] = data[i][j]

    tempShip['name'] = gameData.ships[tempShip['ship_id']].name
    tempShip['type'] = gameData.shipTypes[
      gameData.ships[tempShip['ship_id']].type].name

    id = tempShip['id']
    tempShipList[id] = tempShip 
  }

  admiral.ships = tempShipList
}

module.exports = function (socket) {
  io = socket
  return updateShips
}