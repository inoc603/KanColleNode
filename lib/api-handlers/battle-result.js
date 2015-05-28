var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')

function battleResult (req, data, admiral) {
  console.log(data)

  var enemy = {}
  enemy.id = admiral.lastEnemyId
  enemy.ships = _.without(data.api_ship_id, -1)
  enemy.name = data.api_enemy_info.api_deck_name
  enemy.formation = admiral.lastEnemyFormation

  if (typeof gameData.enemy[enemy.id] == 'undefined') {
    console.log('enemy fleet No.', enemy.id, 'added')
  	gameData.enemy[enemy.id] = enemy
  	gameData.store('enemy')
  }

  var record = {}
  record.rank = data.api_win_rank
  record.map_area = admiral.lastMapArea
  record.map_number = admiral.lastMapNum
  record.map_point = admiral.lastMapPoint
  record.enemy_id = enemy.id
  var mvp = admiral.fleets[admiral.fleetOnSortie].ships[data.api_mvp - 1]
  record.mvp_id = mvp.id
  record.mvp_name = mvp.name
  record.time = new Date()

  if (data.api_get_ship)
    record.get_ship_name = data.api_get_ship.api_ship_name
  else
    record.get_ship_name = ''

  admiral.insertBattleResult(record)

  if (admiral.client)
    io.to(admiral.client).emit('battle_result', record)
  else
    io.emit('battle_result', record)
}

function storeRecordCsv (record, admiral) {
  var line = record.date
  line += (',' + record.time)
  line += (',' + record.mapArea)
  line += (',' + record.mapNum)
  line += (',' + record.mapPoint)
  line += (',' + record.enemyId)
  line += (',' + record.rank)
  line += (',' + record.mvpId)
  line += (',' + record.mvpName)
  line += (',' + record.shipGet)
  line += '\r\n'
  var recordFileName = 'admiral/'+admiral.memberId+'/record.csv'
  try {
      if (fs.existsSync(recordFileName)) {
      console.log('file exists')
      fs.appendFileSync(recordFileName, line)
    }
    else {
      var header = 'date,time,map_area,map_num,map_point,enemy_id,rank'
                 + ',mvp_id,mvp_name,ship_get\r\n'
      fs.writeFileSync(recordFileName, header+line)
    }
  }
  catch (e) {
    console.log(e)
  }
}

module.exports.handler = function (socket) {
  io = socket
  return battleResult
}

module.exports.api = [ '/api_req_sortie/battleresult'
                     , '/api_req_combined_battle/battleresult'
                     ]
