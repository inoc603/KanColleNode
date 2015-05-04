var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')
  , battleUtil = require('./battle-util')

function getBattle (req, data, admiral) {
  var friendly = battleUtil.initFriendlyDay(data, admiral)
    , enemy = battleUtil.initEnemyDay(data, admiral)
  
  battleUtil.calculateAirAttack(data, friendly, enemy)

  for (var i in data.api_hourai_flag.slice(0, 3))
    if (data.api_hourai_flag[i] == 1)
      battleUtil.calculateArtilery( friendly.ships
                                 , enemy.ships
                                 , data['api_hougeki'+(parseInt(i)+1)])

  if (data.api_hourai_flag[3] == 1)
    battleUtil.calculateTropedo(friendly.ships, enemy.ships, data.api_raigeki)

  if (data.api_opening_flag ==1)
    battleUtil.calculateTropedo( friendly.ships
                               , enemy.ships
                               , data.api_opening_atack)

  if (data.api_support_flag != 0)
    battleUtil.calculateSupport(data, enemy)

  battleUtil.calculateDayEndHp(friendly.ships)
  battleUtil.calculateDayEndHp(enemy.ships)
  friendly.casualty = battleUtil.calculateDayCasualty(friendly.ships)
  enemy.casualty = battleUtil.calculateDayCasualty(enemy.ships)

  var send = {}
  send.friendly = friendly
  send.enemy = enemy
  send.stance = data.api_formation[2]
  // send.air = {}
  // send.air.stage1 = data.api_kouku.api_stage1
  // send.air.stage2 = data.api_kouku.api_stage2
  // send.air.stage3 = data.api_kouku.api_stage3
  
  if (admiral.client)
    io.to(admiral.client).emit('day_battle_update', send)
  else
    io.emit('day_battle_update', send)
}

module.exports.handler = function (socket) {
  io = socket
  return getBattle
}

module.exports.api = ['/api_req_sortie/battle']
