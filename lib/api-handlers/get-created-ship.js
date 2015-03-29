var io = null
  , gameData = require('../gameData')
  , updateBuild = require('./update-build')

function getCreatedShip (req, data, admiral) {
  console.log('get created ship')
  console.log(data)
  console.log(data['api_kdock'])
  updateBuild(req, data['api_kdock'], admiral)
}

module.exports = function (socket) {
  io = socket
  return getCreatedShip
}