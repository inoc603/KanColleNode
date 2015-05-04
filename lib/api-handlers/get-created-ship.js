var io = null
  , gameData = require('../game-data')
  , updateBuild = function () {}

function getCreatedShip (req, data, admiral) {
  updateBuild(req, data.api_kdock, admiral)
}

module.exports.handler = function (socket) {
  io = socket
  updateBuild = require('./update-build').handler(io)
  return getCreatedShip
}

module.exports.api = ['/api_req_kousyou/getship']