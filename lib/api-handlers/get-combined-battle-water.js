var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')
  , async = require('async')

function getCombinedBattle (req, data, admiral) {
  var friendly = {}
    , enemy = initEnemy(data, admiral)

  friendly.back = initFriendlyBack(data, admiral)
  friendly.front = initFriendlyFront(data, admiral)
  friendly.formation = data.api_formation[0]

  // air to ship attack
  if (data.api_stage_flag[2] == 1) {
    // with fleet in the back
    var fdam = _.rest(data.api_kouku.api_stage3.api_fdam)
      , edam = _.rest(data.api_kouku.api_stage3.api_edam)

    for (var i in fdam)
      if (friendly.back.ships[i])
        friendly.back.ships[i].damage_receive += fdam[i]

    for (var i in edam)
      if (enemy.ships[i])
        enemy.ships[i].damage_receive += edam[i]

    // with fleet in the front
    var fdam = _.rest(data.api_kouku.api_stage3_combined.api_fdam)

    for (var i in fdam)
      if (friendly.front.ships[i])
        friendly.front.ships[i].damage_receive += fdam[i]
  }

  var flag
  console.log(data.api_hourai_flag)

  console.log('openning tropedo')
  if (data.api_opening_flag ==1) {
    if (data.api_opening_atack)
      flag = calculateTropedo( friendly.front.ships
                             , enemy.ships
                             , data.api_opening_atack)
    else
      console.log('no openning')
  }
  else {
    console.log('no openning tropedo')
  }

  console.log('fire round 1')
  if (data.api_hourai_flag[0] == 1) {
    if (data.api_hougeki1)
      flag = calculateArtilery( friendly.back.ships
                              , enemy.ships
                              , data.api_hougeki1)
  }
  else {
    console.log('no round 1')
  }
  
  console.log('fire round 2')
  if (data.api_hourai_flag[1] == 1) {
    if (data.api_hougeki2)
      flag = calculateArtilery( friendly.back.ships
                              , enemy.ships
                              , data.api_hougeki2)
  }
  else {
    console.log('no round 2')
  }
    
  console.log('fire round 3')
  if (data.api_hourai_flag[2] == 1) {
    if (data.api_hougeki3)
      flag = calculateArtilery( friendly.front.ships
                              , enemy.ships
                              , data.api_hougeki3)
  }
  else {
    console.log('no round 3')
  }

  console.log('closing tropedo')
  if (data.api_hourai_flag[3] == 1) {
    if (data.api_raigeki)
      flag = calculateTropedo( friendly.front.ships
                             , enemy.ships
                             , data.api_raigeki)
    else
      console.log('no closing')
  }
  else {
    console.log('no closing tropedo')
  }

  flag = calculateDayEndHp(friendly.front.ships)
  flag = calculateDayEndHp(friendly.back.ships)
  flag = calculateDayEndHp(enemy.ships)
  friendly.casualty = calculateDayCasualtyCombined( friendly.front.ships
                                                  , friendly.back.ships)
  console.log(friendly.casualty)
  enemy.casualty = calculateDayCasualty(enemy.ships)
  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  send.stance = data.api_formation[2]
  send.air = {}
  send.air.stage1 = data.api_kouku.api_stage1
  send.air.stage2 = data.api_kouku.api_stage2
  send.air.stage3 = data.api_kouku.api_stage3

  // console.log(JSON.stringify(send, null, 2))
  
  if (admiral.client)
    io.to(admiral.client).emit('day_combined_battle_update', send)
  else
    io.emit('day_combined_battle_update', send)
}

function calculateArtilery (friendly, enemy, data) {
  var target = _.rest(data.api_df_list)
  for (var i in target) {
    target[i] = target[i][0] 
  }
  var damage = _.rest(data.api_damage)
  for (var i in damage) {
    damage[i] = damage[i].reduce(function(pv, cv) { return pv + cv; }, 0)
  }

  var temp = _.zip(_.rest(data.api_at_list), target, damage)
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
  return 0
}

function calculateTropedo (friendly, enemy, data) {
  console.log('tropedo')
  var fdam = _.rest(data.api_fdam)
    , edam = _.rest(data.api_edam)
    , fydam = _.rest(data.api_fydam)
    , eydam = _.rest(data.api_eydam)

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

  return 0
}

function calculateDayEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship.day_end_hp = ( ship.day_start_hp > ship.damage_receive
                      ? ship.day_start_hp - ship.damage_receive
                      : 0)
  }
  return 0
}

function calculateDayCasualty (ships) {
  var damage = ships.reduce(function (pv, cv) {
    return pv + cv.day_start_hp - cv.day_end_hp
  }, 0)
  var start = ships.reduce(function (pv, cv) {
    return pv + cv.day_start_hp
  }, 0)
  return damage / start
}

function calculateDayCasualtyCombined (shipsF, shipsB) {
  var damage = shipsF.reduce(function (pv, cv) {
    return pv + cv.day_start_hp - cv.day_end_hp
  }, shipsB.reduce(function (pv, cv) {
    return pv + cv.day_start_hp - cv.day_end_hp
  }, 0))

  var start = shipsF.reduce(function (pv, cv) {
    return pv + cv.day_start_hp
  }, shipsB.reduce(function (pv, cv) {
    return pv + cv.day_start_hp
  }, 0))

  return damage / start
}

function initFriendlyBack (data, admiral) {
  var friendly = {}
  friendly.ships = []
  fleet = admiral.fleets[0]
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
    if (data.api_maxhps[i] != -1)
      friendly.ships[i-1].max_hp = data.api_maxhps[i]
  for (var i = 1; i <= 6; i++)
    if (data.api_nowhps[i] != -1)
      friendly.ships[i-1].day_start_hp = data.api_nowhps[i]

  // console.log('FB:', friendly)
  return friendly
}

function initFriendlyFront (data, admiral) {
  var friendly = {}
  friendly.ships = []
  fleet = admiral.fleets[1]
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
    if (data.api_maxhps_combined[i] != -1)
      friendly.ships[i-1].max_hp = data.api_maxhps_combined[i]
  for (var i = 1; i <= 6; i++)
    if (data.api_nowhps_combined[i] != -1)
      friendly.ships[i-1].day_start_hp = data.api_nowhps_combined[i]

  
  // console.log('FF:', friendly)

  return friendly
}

function initEnemy (data, admiral) {
  var enemy = {}
  enemy.ships = []
  fleet = _.rest(data.api_ship_ke)
  for (var i in fleet)
    if (fleet[i] != -1) {
      var temp = _.clone(gameData.ships[fleet[i]])
      temp.damage = 0
      temp.damage_receive = 0
      enemy.ships.push(temp)
    }

  for (var i = 7; i <= 12; i++)
    if (data.api_maxhps[i] != -1)
      enemy.ships[i-7].max_hp = data.api_maxhps[i]

  for (var i = 7; i <= 12; i++)
    if (data.api_nowhps[i] != -1)
      enemy.ships[i-7].day_start_hp = data.api_nowhps[i]

  enemy.formation = data.api_formation[1]
  admiral.lastEnemyFormation = enemy.formation

  // console.log('E:', enemy)

  return enemy
}

module.exports.handler = function (socket) {
  io = socket
  return getCombinedBattle
}

module.exports.api = ['/api_req_combined_battle/battle_water']
