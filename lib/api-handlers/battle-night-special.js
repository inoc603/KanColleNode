var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')
  , battleUtil = require('./battle-util')

function getSpeciaNight (req, data, admiral) {
  var friendly = battleUtil.initFriendlyNight(data, admiral)
    , enemy = battleUtil.initEnemyNight(data)

  battleUtil.calculateArtilery( friendly.ships
                             , enemy.ships
                             , data.api_hougeki)

  battleUtil.calculateNightEndHp(friendly.ships)
  battleUtil.calculateNightEndHp(enemy.ships)

  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  send.special = true

  if (admiral.client)
    io.to(admiral.client).emit('night_battle_update', send)
  else
    io.emit('night_battle_update', send)
  console.log(data)
}

module.exports.handler = function (socket) {
  io = socket
  return getSpeciaNight
}

module.exports.api = ['/api_req_battle_midnight/sp_midnight']
