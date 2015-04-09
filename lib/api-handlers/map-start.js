var io = null
  , gameData = require('../gameData')
  , _ = require('underscore')

function mapStart (req, data, admiral) {
  var send = {}
  send['map_area'] = req['api_maparea_id']
  send['map_num'] = req['api_mapinfo_no']
  send['map_point'] = data['api_no']
  
  admiral.fleetOnSortie = parseInt(req['api_deck_id'])-1
  send['fleet'] = admiral.fleets[admiral.fleetOnSortie]

  if (data['api_event_kind'] == 1) {
    admiral.lastEnemyId = data['api_enemy']['api_enemy_id']
    send['enemy'] = initEnemy(admiral.lastEnemyId)
    send['event'] = 'battle'
  }
  else {
    send['event'] = 'peace'
  }

  if (admiral.client)
    io.to(admiral.client).emit('map_start', send)
  else
    io.emit('map_start', send)
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

module.exports = function (socket) {
  io = socket
  return mapStart
}
