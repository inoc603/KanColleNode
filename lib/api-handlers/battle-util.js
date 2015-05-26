var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')

function calculateArtilery (friendly, enemy, data) {
  // console.log(data)
  var target = _.rest(data.api_df_list)
  for (var i in target) {
    target[i] = target[i][0]
  }
  // console.log(target)
  var damage = _.rest(data.api_damage)
  for (var i in damage) {
    damage[i] = damage[i].reduce(function(pv, cv) { return pv + cv; }, 0)
  }
  // console.log(damage)

  var temp = _.zip(_.rest(data.api_at_list), target, damage)
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
  var fdam = _.rest(data.api_fdam)
    , edam = _.rest(data.api_edam)
    , fydam = _.rest(data.api_fydam)
    , eydam = _.rest(data.api_eydam)

  for (var i in fdam)
    if (friendly[i])
      friendly[i].damage_receive += fdam[i]

  for (var i in edam)
    if (enemy[i])
      enemy[i].damage_receive += edam[i]

  for (var i in fydam)
    if (friendly[i])
      friendly[i].damage += fydam[i]

  for (var i in eydam)
    if (enemy[i])
      enemy[i].damage += eydam[i]
}

function calculateNightEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship.end_hp = ( ship.start_hp > ship.damage_receive
                       ? ship.start_hp - ship.damage_receive
                       : 0)
  }
}

function initFriendlyDay (data, admiral) {
  var friendly = {}
    , fleetNum = ( data.api_dock_id
                 ? data.api_dock_id-1
                 : parseInt(data.api_deck_id)-1)
    , fleet = admiral.fleets[fleetNum]

  friendly.name = fleet.name
  friendly.ships = []
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
      friendly.ships[i-1].start_hp = data.api_nowhps[i]

  friendly.formation = data.api_formation[0]

  return friendly
}

function initFriendlyNight (data, admiral) {
  var friendly = {}
    , fleetNum = ( data.api_dock_id
                 ? data.api_dock_id-1
                 : parseInt(data.api_deck_id)-1)
    , fleet = admiral.fleets[fleetNum]

  friendly.name = fleet.name
  friendly.ships = []
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
      friendly.ships[i-1].start_hp = data.api_nowhps[i]

  if (data.api_formation)
    friendly.formation = data.api_formation[0]

  return friendly
}

function calculateSupport (data, enemy) {
  switch (data.api_support_flag) {
    case 1:
      var support = data.api_support_info.api_support_airatack
        , edam = _.rest(support.api_stage3.api_edam)
      for (var i in edam)
        if (enemy.ships[i])
          enemy.ships[i].damage_receive += edam[i]
      break
    case 2:
      var support = data.api_support_info.api_support_hourai
        , edam = _.rest(support.api_damage)
      for (var i in edam)
        if (enemy.ships[i])
          enemy.ships[i].damage_receive += edam[i]
      break
    default:
      break
  }
}

function calculateDayEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship.end_hp = ( ship.start_hp > ship.damage_receive
                  ? ship.start_hp - ship.damage_receive
                  : 0)
  }
}

function calculateDayCasualty (ships) {
  var damage = ships.reduce(function (pv, cv) {
    return pv + cv.start_hp - cv.end_hp
  }, 0)
  var start = ships.reduce(function (pv, cv) {
    return pv + cv.start_hp
  }, 0)
  return damage / start
}

function calculateNightEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship.end_hp = ( ship.start_hp > ship.damage_receive
                  ? ship.start_hp - ship.damage_receive
                  : 0)
  }
}

function initEnemyDay (data, admiral) {
  var enemy = {}
    , fleet = _.rest(data.api_ship_ke)

  enemy.ships = []
  for (var i in fleet)
    if (fleet[i] != -1) {
      var ship = _.clone(gameData.ships[fleet[i]])
      ship.damage = 0
      ship.damage_receive = 0
      enemy.ships.push(ship)
    }

  for (var i = 7; i <= 12; i++)
    if (data.api_maxhps[i] != -1)
      enemy.ships[i-7].max_hp = data.api_maxhps[i]

  for (var i = 7; i <= 12; i++)
    if (data.api_nowhps[i] != -1)
      enemy.ships[i-7].start_hp = data.api_nowhps[i]

  enemy.formation = data.api_formation[1]
  admiral.lastEnemyFormation = enemy.formation

  return enemy
}

function calculateAirAttack (data, friendly, enemy, admiral) {
  if (data.api_stage_flag[2] == 1) {
    var fdam = _.rest(data.api_kouku.api_stage3.api_fdam)
      , edam = _.rest(data.api_kouku.api_stage3.api_edam)
    for (var i in fdam)
      if (friendly.ships[i])
        friendly.ships[i].damage_receive += fdam[i]

    for (var i in edam)
      if (enemy.ships[i])
        enemy.ships[i].damage_receive += edam[i]
  }
}

function initFriendlyNight (data, admiral) {
  var friendly = {}
  friendly.ships = []
  fleet = admiral.fleets[parseInt(data.api_deck_id)-1]

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
      friendly.ships[i-1].start_hp = data.api_nowhps[i]

  return friendly
}

function initEnemyNight (data) {
  var enemy = {}
  enemy.ships = []
  fleet = data.api_ship_ke.slice(1,7)
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
      enemy.ships[i-7].start_hp = data.api_nowhps[i]

  if (data.api_formation)
    enemy.formation = data.api_formation[1]

  return enemy
}

function calculateNightCasualty (ships, dayShips) {
  var start = dayShips.reduce(function (total, ship) {
        return total + ship.start_hp
      }, 0)
    , end = ships.reduce(function (total, ship) {
        return total + ship.end_hp
      })
  return (start - end) / start
}

function getDayMVP (ships) {
  return ships.reduce(function (mvp, ship) {
        return (mvp.damage > ship.damage? mvp: ship)
      }, {damage: -1}).name
}

function getNightMVP (ships, dayShips) {
}

// NOT FULLY IMPLEMENTED
// SEE http://wikiwiki.jp/kancolle/?%BE%A1%CD%F8%BE%F2%B7%EF FOR DETAIL
function calculateRank (data) {
  var rankABottomLine = { '6': 4
                        , '5': 3
                        , '4': 2
                        , '3': 2
                        , '2': 1
                        , '1': 7
                        }
    , enemySunk = data.enemy.ships.reduce(function (count, ship) {
        var endHp = (ship.end_hp? ship.end_hp: ship.end_hp)
        if (endHp == 0) count++
        return count
      }, 0)

    , friendlySunk = data.friendly.ships.reduce(function (count, ship) {
        var endHp = (ship.end_hp? ship.end_hp: ship.end_hp)
        if (endHp == 0) count++
        return count
      }, 0)

    , friendlyCasualty = data.friendly.casualty
    , enemyCasualty = data.enemy.casualty

    , enemyFlagSunk = (data.enemy.ships[0].end_hp == 0)
    , shipLost = (friendlySunk > 0)
    , rankA = (enemySunk >= rankABottomLine[data.enemy.ships.length])
    , moreDamage = (enemyCasualty * 2.5 > friendlyCasualty)

  if (enemySunk == data.enemy.ships.length) {
    if (friendlyCasualty == 0) return 'SS'
    if (shipLost) return 'B'
    return 'S'
  }

  if (rankA && !shipLost) return 'A'
  if (enemyFlagSunk && !shipLost) return 'B'
  if (friendlyCasualty == 0 && enemyCasualty > 0) return 'B'
  if (moreDamage && !shipLost) return 'B'
  if (shipLost && rankA && moreDamage) return 'B'
  if (shipLost && enemySunk > friendlySunk && enemyFlagSunk) return 'B'
  if (enemyCasualty > 0) return 'C'
  if (!enemyFlagSunk && !moreDamage) return 'C'
  if (shipLost && enemyFlagSunk && enemySunk <= friendlySunk) return 'C'

  return 'D'
}

module.exports.initFriendlyDay = initFriendlyDay
module.exports.initFriendlyNight = initFriendlyNight

module.exports.initEnemyDay = initEnemyDay
module.exports.initEnemyNight = initEnemyNight

module.exports.calculateAirAttack = calculateAirAttack
module.exports.calculateSupport = calculateSupport
module.exports.calculateArtilery = calculateArtilery
module.exports.calculateTropedo = calculateTropedo

module.exports.calculateDayEndHp = calculateDayEndHp
module.exports.calculateNightEndHp = calculateNightEndHp
module.exports.calculateDayCasualty = calculateDayCasualty
module.exports.calculateNightCasualty = calculateNightCasualty

module.exports.calculateRank = calculateRank
module.exports.getDayMVP = getDayMVP
// module.exports.calculateNightCasualty = calculateNightCasualty


