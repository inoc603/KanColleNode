var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')

function getAirBattle (req, data, admiral) {
  console.log(data)
  d = new Date()
  fileName = d.toTimeString().substr(0, 8).replace(/\:/g, '_') + '_air.json'
  fileContent = JSON.stringify(data, null, 2)
  fs.writeFile(fileName, fileContent)
  
  var friendly = initFriendly(data, admiral)
    , enemy = initEnemy(data, admiral)

  calculateAir(friendly, enemy, data['api_stage_flag'], data['api_kouku'])
  calculateAir(friendly, enemy, data['api_stage_flag2'], data['api_kouku2'])

  calculateDayEndHp(friendly.ships)
  calculateDayEndHp(enemy.ships)
  friendly.casualty = calculateDayCasualty(friendly.ships)
  enemy.casualty = calculateDayCasualty(enemy.ships)

  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  send.stance = data['api_formation'][2]
  // send.air = {}
  // send.air.stage1 = data['api_kouku']['api_stage1']
  // send.air.stage2 = data['api_kouku']['api_stage2']
  // send.air.stage3 = data['api_kouku']['api_stage3']
  
  if (admiral.client)
    io.to(admiral.client).emit('day_battle_update', send)
  else
    io.emit('day_battle_update', send)
}

function calculateDayEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship['day_end_hp'] = ( ship['day_start_hp'] > ship['damage_receive']
                         ? ship['day_start_hp'] - ship['damage_receive']
                         : 0)
  }
}

function calculateDayCasualty (ships) {
  var damage = ships.reduce(function (pv, cv) {
    return pv + cv['day_start_hp'] - cv['day_end_hp']
  }, 0)
  var start = ships.reduce(function (pv, cv) {
    return pv + cv['day_start_hp']
  }, 0)
  return damage / start
}

function initFriendly (data, admiral) {
  var friendly = {}
  friendly.ships = []
  fleet = admiral.fleets[data['api_dock_id']-1]
  friendly.name = fleet.name
  for (var i in fleet.ships) {
    var temp = {}
    temp.id = fleet.ships[i].id
    temp.name = fleet.ships[i].name
    temp.level = fleet.ships[i].level
    temp.damage = 0
    temp.damage_receive = 0
    friendly.ships.push(temp)
  }
  for (var i = 1; i <= 6; i++)
    if (data['api_maxhps'][i] != -1)
      friendly.ships[i-1]['max_hp'] = data['api_maxhps'][i]
  for (var i = 1; i <= 6; i++)
    if (data['api_nowhps'][i] != -1)
      friendly.ships[i-1]['day_start_hp'] = data['api_nowhps'][i]

  friendly.formation = data['api_formation'][0]
  return friendly
}

function calculateAir (friendly, enemy, stageFlag, data) {
  if (stageFlag[2] == 1) {
    var fdam = _.rest(data['api_stage3']['api_fdam'])
      , edam = _.rest(data['api_stage3']['api_edam'])
    for (var i in fdam)
      if (typeof friendly.ships[i] != 'undefined')
        friendly.ships[i].damage_receive += fdam[i]

    for (var i in edam)
      if (typeof enemy.ships[i] != 'undefined')
        enemy.ships[i].damage_receive += edam[i]
  }
}

function initEnemy (data, admiral) {
  var enemy = {}
  enemy.ships = []
  fleet = data['api_ship_ke'].slice(1, 7)
  for (var i in fleet)
    if (fleet[i] != -1) {
      var temp = _.clone(gameData.ships[fleet[i]])
      temp.damage = 0
      temp.damage_receive = 0
      enemy.ships.push(temp)
    }

  for (var i = 7; i <= 12; i++)
    if (data['api_maxhps'][i] != -1)
      enemy.ships[i-7]['max_hp'] = data['api_maxhps'][i]

  for (var i = 7; i <= 12; i++)
    if (data['api_nowhps'][i] != -1)
      enemy.ships[i-7]['day_start_hp'] = data['api_nowhps'][i]

  enemy.formation = data['api_formation'][1]
  admiral.lastEnemyFormation = enemy.formation

  return enemy
}

module.exports = function (socket) {
  io = socket
  return getAirBattle
}
