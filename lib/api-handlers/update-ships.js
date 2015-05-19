var io = null
  , gameData = require('../game-data')
  , Ship = require('../models/ship')
  , Item = require('../models/item')

function updateShips (req, data, admiral, partUpdate) {
  var send = { 'current_ship' : data.length}

  if (admiral.client)
    io.to(admiral.client).emit('basic_update', send)
  else
    io.emit('basic_update', send)

  if (!partUpdate) {
    console.log('full update')
    var newShips = {}
    for (var i in data) {
      newShips[data[i].api_id] = new Ship(data[i], admiral)
    }
    admiral.ships = newShips
  }
  else {
    console.log('partly update')
    if (!admiral.ships) admiral.ships = {}
    for (var i in data) {
      admiral.ships[data[i].api_id] = new Ship(data[i], admiral)
    }
  }
}

module.exports = function (socket) {
  io = socket
  return updateShips
}
