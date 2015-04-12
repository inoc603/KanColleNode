var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')

function getNightBattle (req, data, admiral) {  
  var friendly = initFriendly(data, admiral)
    , enemy = initEnemy(data)

  calculateArtilery( friendly.ships
                   , enemy.ships
                   , data['api_hougeki'])

  calculateNightEndHp(friendly.ships)
  calculateNightEndHp(enemy.ships)

  console.log('end')
  console.log(friendly)
  console.log(enemy)

  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  
  if (admiral.client)
    io.to(admiral.client).emit('night_battle_update', send)
  else
    io.emit('night_battle_update', send)
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

function calculateNightEndHp (ships) {
  for (var i in ships) {
    var ship = ships[i]
    ship['night_end_hp'] = ( ship['night_start_hp'] > ship['damage_receive']
                         ? ship['night_start_hp'] - ship['damage_receive']
                         : 0)
  }
}

function initFriendly (data, admiral) {
  var friendly = {}
  friendly.ships = []
  fleet = admiral.fleets[parseInt(data['api_deck_id'])-1]
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
      friendly.ships[i-1]['night_start_hp'] = data['api_nowhps'][i]

  return friendly
}

function initEnemy (data) {
  var enemy = {}
  enemy.ships = []
  fleet = data['api_ship_ke'].slice(1,7)
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
      enemy.ships[i-7]['night_start_hp'] = data['api_nowhps'][i]

  return enemy
}

module.exports = function (socket) {
  io = socket
  return getNightBattle
}
