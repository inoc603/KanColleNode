var newKeys = { 'api_fuel': 'fuel'
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
  , gameData = require('../game-data')
  , fs = require('fs')
  , Item = require('./item')

var Ship = function (shipData, admiral) {
  var shipId = shipData.api_ship_id
    , template = gameData.ships[shipId]
  // console.log(template)

  for (var key in template)
    this[key] = template[key]
  for (var key in newKeys)
    this[newKeys[key]] = shipData[key]

  this.type = gameData.shipTypes[this.type].name
  if (!admiral.equipment) {
    try {
      admiral.equipment = JSON.parse(
        fs.readFileSync('admiral/' + admiral.memberId + '/equipment.json')
          .toString())
    }
    catch (e) {
      console.log(e)
    }
  }
  for (var i in this.equipment) {
    // console.log(admiral.equipment[this.equipment[i]])
    if (admiral.equipment[this.equipment[i]]) {
      // var itemId = admiral.equipment[this.equipment[i]].item_id
      // , item = gameData.equipment[itemId]
      // console.log(item)
      var itemTest = new Item({id: this.equipment[i]}, admiral)
      this.equipment[i] = itemTest
      // console.log(itemTest)
    }
    else {
      this.equipment[i] = undefined
    }

  }
}

module.exports = Ship
