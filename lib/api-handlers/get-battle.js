var io = null
  , gameData = require('../gameData')
  , _ = require('underscore')
  , fs = require('fs')

function getBattle (req, data, admiral) {
  // d = new Date()
  // fileName = d.toTimeString().substr(0, 8).replace(/\:/g, '_') + '_battle.json'
  // fileContent = JSON.stringify(data, null, 2)
  // fs.writeFile(fileName, fileContent)
  
  var friendly = initFriendly(data, admiral)
    , enemy = initEnemy(data, admiral)
  
  if (data['api_stage_flag'][2] == 1) {
    var fdam = _.rest(data['api_kouku']['api_stage3']['api_fdam'])
      , edam = _.rest(data['api_kouku']['api_stage3']['api_edam'])
    for (var i in fdam)
      if (typeof friendly.ships[i] != 'undefined')
        friendly.ships[i].damage_receive += fdam[i]

    for (var i in edam)
      if (typeof enemy.ships[i] != 'undefined')
        enemy.ships[i].damage_receive += edam[i]

  }

  for (var i in data['api_hourai_flag'].slice(0, 3))
    if (data['api_hourai_flag'][i] == 1)
      calculateArtilery( friendly.ships
                       , enemy.ships
                       , data['api_hougeki'+(parseInt(i)+1)])

  if (data['api_hourai_flag'][3] == 1)
    calculateTropedo(friendly.ships, enemy.ships, data['api_raigeki'])

  if (data['api_opening_flag'] ==1)
    calculateTropedo(friendly.ships, enemy.ships, data['api_opening_atack'])

  calculateDayEndHp(friendly.ships)
  calculateDayEndHp(enemy.ships)
  friendly.casualty = calculateDayCasualty(friendly.ships)
  enemy.casualty = calculateDayCasualty(enemy.ships)

  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  send.stance = data['api_formation'][2]
  
  if (admiral.client)
    io.to(admiral.client).emit('day_battle_update', send)
  else
    io.emit('day_battle_update', send)
}

function calculateArtilery (friendly, enemy, data) {
  // console.log(data)
  var target = _.rest(data['api_df_list'])
  for (var i in target) {
    target[i] = target[i][0] 
  }
  // console.log(target)
  var damage = _.rest(data['api_damage'])
  for (var i in damage) {
    damage[i] = damage[i].reduce(function(pv, cv) { return pv + cv; }, 0)
  }
  // console.log(damage)

  var temp = _.zip(_.rest(data['api_at_list']), target, damage)
  // console.log(temp)
  for (var i in temp) {
    if (temp[i][0] > 6) {
      enemy[temp[i][0] - 7].damage += temp[i][2]
      friendly[temp[i][1] - 1].damage_receive += temp[i][2]
    }
    else {
      enemy[temp[i][1] - 7].damage_receive += temp[i][2]
      friendly[temp[i][0] - 1].damage += temp[i][2]
    }
  }
  // console.log(enemy)
  // console.log(friendly)
}

function calculateTropedo (friendly, enemy, data) {
  var fdam = _.rest(data['api_fdam'])
    , edam = _.rest(data['api_edam'])
    , fydam = _.rest(data['api_fydam'])
    , eydam = _.rest(data['api_eydam'])

  for (var i in fdam)
    if (typeof friendly[i] != 'undefined')
      friendly[i].damage_receive += fdam[i]

  for (var i in edam)
    if (typeof enemy[i] != 'undefined')
      enemy[i].damage_receive += edam[i]

  for (var i in fydam)
    if (typeof friendly[i] != 'undefined')
      friendly[i].damage += fydam[i]

  for (var i in eydam)
    if (typeof enemy[i] != 'undefined')
      enemy[i].damage += eydam[i]
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
  return getBattle
}
