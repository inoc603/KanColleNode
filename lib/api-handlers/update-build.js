var io = null
  , gameData = require('../game-data')

function getBuildDock (req, data, admiral) {
  admiral.buildDock = {}
  for (var i in data) {
    var temp = {}
    temp.ship_id = data[i].api_created_ship_id
    temp.state = data[i].api_state
    temp.complete_time = data[i].api_complete_time
    if (temp.ship_id != 0 && temp.ship_id != -1) {
      temp.name = gameData.ships[temp.ship_id].name
      console.log(gameData.shipTypes[gameData.ships[temp.ship_id].type].name)
      var param = { 'get_ship_name': temp.name
                  , 'get_ship_type': gameData.shipTypes[
                                        gameData.ships[temp.ship_id].type].name
                  , 'dock': data[i].api_id
                  }
      if (admiral.db)
        admiral.updateBuildShip(param)
    }
      
    admiral.buildDock[data[i].api_id] = temp
    console.log(temp)
  }

  if (admiral.client)
    io.to(admiral.client).emit('kdock_update', admiral.buildDock)
  else
    io.emit('kdock_update', admiral.buildDock)

}

module.exports.handler = function (socket) {
  io = socket
  return getBuildDock
}

module.exports.api = ['/api_get_member/kdock']