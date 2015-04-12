var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')

function battleResult (req, data, admiral) {
  send = {}
  console.log(data)

  var enemy = {}
  enemy.id = admiral.lastEnemyId
  enemy.ships = _.without(data['api_ship_id'], -1)
  enemy.name = data['api_enemy_info']['api_deck_name']
  enemy.formation = admiral.lastEnemyFormation

  if (typeof gameData.enemy[enemy.id] == 'undefined') {
    console.log('enemy fleet No.', enemy.id, 'added')
  	gameData.enemy[enemy.id] = enemy
  	gameData.store('enemy')
  }
  	
  if (admiral.client)
    io.to(admiral.client).emit('battle_result', send)
  else
    io.emit('battle_result', send)
}

module.exports = function (socket) {
  io = socket
  return battleResult
}
