var io = require('../globals').io
  , gameData = require('../game-data')
  , fs = require('fs')

function getBasic (req, data, admiral) {
  var send = {}
    , newKeyForBasic = { 'api_level' : 'level'
                       , 'api_rank' : 'rank'
                       , 'api_experience' : 'exp'
                       , 'api_max_chara' : 'max_ship'
                       , 'api_max_slotitem' : 'max_equipment'
                       , 'api_count_deck' : 'fleet_count'
                       , 'api_count_ndock' : 'repair_dock_count'
                       , 'api_count_kdock' : 'build_dock_count'
                       , 'api_nickname' : 'name'
                       }

  for (key in newKeyForBasic)
    send[newKeyForBasic[key]] = data[key]

  if (!admiral.memberId) {
    send.mix_id = data.api_member_id + data.api_nickname_id
    admiral.memberId = data.api_member_id
    admiral.nicknameId = data.api_nickname_id
    if (!fs.existsSync(admiral.getDataDir())) {
      fs.mkdirSync(admiral.getDataDir())
    }
    admiral.initDatabase()
  }

  send.mix_id = data.api_member_id + data.api_nickname_id

  io.emit('basic_update', send)
}

module.exports = getBasic
