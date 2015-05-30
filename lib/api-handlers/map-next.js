var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function mapNext (req, data, admiral) {
  console.log(data)
  admiral.lastMapPoint = data.api_no
  var send = {}
  send.fleet = admiral.fleets[admiral.fleetOnSortie]
  if (admiral.combinedBattle) {
    send.fleet_combined = admiral.fleets[1]
  }
  if (data.api_event_kind == 1) {
    admiral.lastEnemyId = data.api_enemy.api_enemy_id
    send.enemy = initEnemy(admiral.lastEnemyId)
    send.event = 'battle'
  }
  else if (data.api_event_kind == 2 && data.api_event_id!=6) {
    admiral.lastEnemyId = data.api_enemy.api_enemy_id
    send.enemy = initEnemy(admiral.lastEnemyId)
    send.event = 'night_battle'
  }
  else if (data.api_event_kind == 4) {
    admiral.lastEnemyId = data.api_enemy.api_enemy_id
    send.enemy = initEnemy(admiral.lastEnemyId, admiral)
    send.event = 'air_battle'
  }
  else {
    send.event = 'peace'
  }
  // console.log(data)
  if (admiral.client)
    io.to(admiral.client).emit('map_next', send)
  else
    io.emit('map_next', send)
}

function initEnemy (eid, admiral) {
  var enemy = {}
    , enemyInfo = gameData.enemy[eid.toString()]

  enemy.id = eid
  if (typeof enemyInfo != 'undefined') {
    var fleet = enemyInfo.ships

    enemy.ships = []
    enemy.formation = enemyInfo.formation
    enemy.name = enemyInfo.name

    for (var i in fleet)
      if (fleet[i] != -1) {
        var temp = _.clone(gameData.ships[fleet[i]])
        temp.damage = 0
        temp.damage_receive = 0
        enemy.ships.push(temp)
      }
  }

  return enemy
}

module.exports.handler = function (socket) {
  io = socket
  return mapNext
}

module.exports.api = ['/api_req_map/next']
