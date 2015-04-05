var io = null
  , gameData = require('../gameData')

function mapNext (req, data, admiral) {
  mapArea = req['api_maparea_id']
  mapInfo = req['api_mapinfo_no']
  admiral.lastEnemyId = data['api_enemy']['api_enemy_id']
  console.log(data)
}

module.exports = function (socket) {
  io = socket
  return mapNext
}
