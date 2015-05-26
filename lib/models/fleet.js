var fs = require('fs')
  , gameData = require('../game-data')
  , _ = require('underscore')

var Fleet = function (fleetData, admiral) {
  // console.log(admiral)

  var fleetNum = fleetData.api_id

  this.name = fleetData.api_name
  this.mission = fleetData.api_mission
  if (this.mission[1] != 0)
    this.mission_name = gameData.expeditions[this.mission[1]].name

  // check if the admiral's equipment info is available
  if (!admiral.equipment) {
    try {
      admiral.equipment = JSON.parse(
        fs.readFileSync('admiral/' + admiral.memberId + '/equipment.json')
          .toString())
    }
    catch (e) {
      console.log(e)
    }
  }

  this.ships = updateFleetShips(fleetData.api_ship, admiral)
  this.anti_air = calculateAntiAir(this.ships, admiral)
  this.tracking = calculateTracking_25old(this.ships, admiral)

}

function updateFleetShips (ships, admiral) {
  var fleet = []
  for (var i in ships)
    if (admiral.ships[ships[i]])
        fleet.push(admiral.ships[ships[i]])

  return fleet
}

function calculateAntiAir (ships, admiral) {
  var antiAir = ships.reduce(function (fleetAA, ship) {
    return fleetAA +
      _.zip(ship.equipment, ship.capacity).reduce(function (shipAA, slot) {
        if (slot[0]) {
          // if (isBattleAircraft(slot[0]))
          if (slot[0].isBattleAircraft())
            shipAA += Math.floor(Math.sqrt(slot[1])*slot[0].anti_air)
        }
        return shipAA
      }, 0)
  }, 0)
  return antiAir
}

function calculateTracking_25old (ships, admiral) {
    var otherTra = 0
    var planeAndRadar = ships.reduce(function (fleetTra, ship) {
      otherTra += ship.tracking[0]
      return fleetTra + ship.equipment.reduce(function (shipTra, slot) {
        if (slot) {
          if (slot.isReconAircraft()) {
            shipTra += slot.tracking * 2
            otherTra -= slot.tracking
          }
          else if (slot.isRadar()) {
            shipTra += slot.tracking
            otherTra -= slot.tracking
          }
        }
        return shipTra
      }, 0)
    }, 0)
    return Math.floor(planeAndRadar + Math.sqrt(otherTra))
}

module.exports = Fleet
