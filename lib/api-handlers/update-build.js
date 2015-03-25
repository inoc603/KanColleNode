var io = null
  , gameData = require('../gameData')

function getBuildDock (req, data, admiral) {
  admiral.buildDock = {}
  for (var i in data) {
    temp = {}
    temp['ship_id'] = data[i]['api_created_ship_id']
    temp['state'] = data[i]['api_state']
    temp['complete_time'] = data[i]['api_complete_time']
    if (temp['ship_id'] != 0 && temp['ship_id'] != -1)
      temp['name'] = gameData.ships[temp['ship_id']]['name']
    admiral.buildDock[data[i]['api_id']] = temp
    console.log(temp)
  }

  if (admiral.client)
    io.to(admiral.client).emit('kdock_update', admiral.buildDock)
  else
    io.emit('kdock_update', admiral.buildDock)

}

module.exports = function (socket) {
  io = socket
  return getBuildDock
}