var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function mapStart (req, data, admiral) {
  var send = {}
  send.map_area = req.api_maparea_id
  send.map_num = req.api_mapinfo_no
  admiral.lastMapArea = send.map_area
  admiral.lastMapNum = send.map_num
  admiral.lastMapPoint = data.api_no

  // check if it's a combined battle
  var checkMap = gameData.combinedMap[send.map_area.toString()]
  if (checkMap) {
    if (checkMap.indexOf(send.map_num) != -1) {
      send.fleet_combined = admiral.fleets[1]
      admiral.combinedBattle = true
    }
    else {
      admiral.combinedBattle = false
    }
  }
  else {
    admiral.combinedBattle = false
  }

  send.map_point = data.api_no
  
  admiral.fleetOnSortie = parseInt(req.api_deck_id)-1
  send.fleet = admiral.fleets[admiral.fleetOnSortie]

  console.log(req)

  if (data.api_event_kind == 1 && data.api_event_id == 4) {
    try {
      admiral.lastEnemyId = data.api_enemy.api_enemy_id
      send.enemy = initEnemy(admiral.lastEnemyId)
      send.event = 'battle'
    }
    catch (e) {
      console.log(e)
    }

  }
  else {
    send.event = 'peace'
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

module.exports.handler = function (socket) {
  io = socket
  return mapStart
}

module.exports.api = ['/api_req_map/start']
