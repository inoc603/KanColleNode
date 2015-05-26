var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')
  , battleUtil = require('./battle-util')

function getAirBattle (req, data, admiral) {
  // console.log(data)
  // d = new Date()
  // fileName = d.toTimeString().substr(0, 8).replace(/\:/g, '_') + '_air.json'
  // fileContent = JSON.stringify(data, null, 2)
  // fs.writeFile(fileName, fileContent)

  var friendly = battleUtil.initFriendlyDay(data, admiral)
    , enemy = battleUtil.initEnemyDay(data, admiral)

  battleUtil.calculateAir(friendly, enemy, data.api_stage_flag, data.api_kouku)
  battleUtil.calculateAir( friendly
                         , enemy, data.api_stage_flag2
                         , data.api_kouku2)

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
  return getAirBattle
}

module.exports.api = ['/api_req_sortie/airbattle']
