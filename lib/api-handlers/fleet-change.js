var io = null
  , gameData = require('../gameData')
  , async = require('async')

function fleetChange (data, admiral) {
  fleet = parseInt(data.api_id)
  index = parseInt(data.api_ship_idx)
  ship = data.api_ship_id
  
  admiral.fleets[fleet - 1].ships[index] = admiral.ships[ship]
  
  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)

}

module.exports = function (socket) {
  io = socket
  return fleetChange
}
