var io = null
  , gameData = require('../game-data')
  , updateShips = function () {}

function shipList2 (req, data, admiral) {
  // console.log(data)
  var fleet = admiral.fleets[admiral.fleetOnSortie]
    , tempShips = []
    , tempName = fleet.name

  for (var ship in fleet.ships) {
    tempShips.push(fleet.ships[ship].id)
  }

  updateShips(req, data, admiral)

  var tempFleet = {}
  tempFleet.name = tempName
  tempFleet.ships = []  

  for (var i in tempShips) {
    if (admiral.ships[tempShips[i]])
        tempFleet.ships.push(admiral.ships[tempShips[i]])
  }

  admiral.fleets[admiral.fleetOnSortie] = tempFleet

  // console.log('[SHIPS2]', tempFleet)

}

function updateFleet (admiral) {
  
}

module.exports = function (socket) {
  io = socket
  updateShips = require('./update-ships')(io)
  return shipList2
}
