var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , fs = require('fs')
  , Fleet = require('../models/fleet')

function updateFleets (data, admiral) {
  // admiral.fleets.length = 0
  for (var i in data) {
    var fleetNum = data[i].api_id
    admiral.fleets[fleetNum-1] = new Fleet(data[i], admiral)
  }

  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)
}

module.exports = function (socket) {
  io = socket
  return updateFleets
}
