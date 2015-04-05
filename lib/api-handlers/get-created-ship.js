var io = null
  , gameData = require('../gameData')
  , updateBuild = function () {}

function getCreatedShip (req, data, admiral) {
  updateBuild(req, data['api_kdock'], admiral)
}

module.exports = function (socket) {
  io = socket
  updateBuild = require('./update-build')(io)
  return getCreatedShip
}