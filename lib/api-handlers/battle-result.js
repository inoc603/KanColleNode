var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , fs = require('fs')
  , time = new Date()

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
  record.mapArea = admiral.lastMapArea
  record.mapNum = admiral.lastMapNum
  record.mapPoint = admiral.lastMapPoint
  record.enemyId = enemy.id
  var mvp = admiral.fleets[admiral.fleetOnSortie].ships[data.api_mvp - 1]
  record.mvpId = mvp.id
  record.mvpName = mvp.name
  record.date = time.toLocaleDateString()
  record.time = time.toLocaleTimeString()
  if (data.api_get_ship)
    record.shipGet = data.api_get_ship.api_ship_name
  else
    record.shipGet = ''
  storeRecordSql(record, admiral)
}

function storeRecordSql (record, admiral) {
  var param = {}
  param.$time = time.toLocaleString()
  param.$map_area = record.mapArea
  param.$map_number = record.mapNum
  param.$map_point = record.mapPoint
  param.$enemy_id = record.enemyId
  param.$rank = record.rank
  param.$mvp_id = record.mvpId
  param.$mvp_name = record.mvpName
  param.$get_ship_name = record.shipGet
  admiral.db.run( 'INSERT INTO battle_log VALUES ('
                  +    '$time,'
                  +    '$map_area,'
                  +    '$map_number,'
                  +    '$map_point,'
                  +    '$enemy_id,'
                  +    '$rank,'
                  +    '$mvp_id,'
                  +    '$mvp_name,'
                  +    '$get_ship_name'
                  + ')'
                , param
                )
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
  console.log(line)
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
