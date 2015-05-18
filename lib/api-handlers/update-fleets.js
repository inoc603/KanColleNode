var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , fs = require('fs')

function updateFleets (data, admiral) {
  admiral.fleets.length = 0
  for (var i in data) {
    var fleet = {}
    fleet.name = data[i].api_name

    fleet.mission = data[i].api_mission
    if (fleet.mission[1] != 0)
      fleet.mission_name = gameData.expeditions[fleet.mission[1]].name

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

    fleet.ships = updateFleetShips(data[i].api_ship, admiral)
    fleet.anti_air = calculateAntiAir(fleet.ships, admiral)
    fleet.tracking = calculateTracking(fleet.ships, admiral)

    admiral.fleets.push(fleet)
  }

  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)
}

function isBattleAircraft (item) {
  return (gameData.equipmentType.battle_plane.indexOf(item.type[2])!=-1)
}

function isAircraft (item) {
  return (gameData.equipmentType.plane.indexOf(item.type[2])!=-1)
}

function isRadar (item) {
  return (gameData.equipmentType.radar.indexOf(item.type[2])!=-1)
}

function isReconAircraft (item) {
  return ([9, 10, 11].indexOf(item.type[2])!=-1)
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
          if (isBattleAircraft(slot[0]))
            shipAA += Math.floor(Math.sqrt(slot[1])*slot[0].anti_air)
        }
        return shipAA
      }, 0)
  }, 0)
  return antiAir
}

function calculateTracking (ships, admiral) {
    var otherTra = 0
    var planeAndRadar = ships.reduce(function (fleetTra, ship) {
      otherTra += ship.tracking[0]
      return fleetTra + ship.equipment.reduce(function (shipTra, slot) {
        if (slot) {
          if (isReconAircraft(slot)) {
            shipTra += slot.tracking * 2
            otherTra -= slot.tracking
          }
          else if (isRadar(slot)) {
            shipTra += slot.tracking
            otherTra -= slot.tracking
          }
        }
        return shipTra
      }, 0)
    }, 0)
    return Math.floor(planeAndRadar + Math.sqrt(otherTra))
}

module.exports = function (socket) {
  io = socket
  return updateFleets
}
