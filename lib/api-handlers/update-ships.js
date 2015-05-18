var io = null
  , gameData = require('../game-data')
  , Ship = require('../models/ship')
  , Item = require('../models/item')

function updateShips (req, data, admiral, partUpdate) {
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

  if (!partUpdate) {
    console.log('full update')
    var newShips = {}
    for (var i in data) {
      newShips[data[i].api_id] = new Ship(data[i], admiral)
      // console.log(data[i].api_id, newShips[data[i].api_id])
    }
    admiral.ships = newShips
  }
  else {
    console.log('partly update')
    if (!admiral.ships) admiral.ships = {}
    for (var i in data) {
      admiral.ships[data[i].api_id] = new Ship(data[i], admiral)
      // console.log(data[i].api_id, newShips[data[i].api_id])
    }
  }


}

module.exports = function (socket) {
  io = socket
  return updateShips
}
