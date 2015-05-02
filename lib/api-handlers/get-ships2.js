var io = null
  , gameData = require('../game-data')
  , updateShips = function () {}

function shipList2 (req, data, admiral) {
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

  // if it's a combined battle, update the second fleet as well
  if (admiral.combinedBattle) {
    var fleet = admiral.fleets[1]
      , tempShips = []
      , tempName = fleet.name
    for (var ship in fleet.ships) {
      tempShips.push(fleet.ships[ship].id)
    }
    var tempFleet = {}
    tempFleet.name = tempName
    tempFleet.ships = []

    for (var i in tempShips) {
      if (admiral.ships[tempShips[i]])
          tempFleet.ships.push(admiral.ships[tempShips[i]])
    }

    admiral.fleets[1] = tempFleet
  }

  // console.log('[SHIPS2]', tempFleet)

}

function updateFleetShips (ships, admiral) {
  var fleet = []
  for (var i in ships) {
    if (admiral.ships[ships[i]])
        fleet.push(admiral.ships[ships[i]])
  }
  return fleet
}

module.exports = function (socket) {
  io = socket
  updateShips = require('./update-ships')(io)
  return shipList2
}
