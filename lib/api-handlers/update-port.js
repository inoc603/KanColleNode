var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , fs = require('fs')
  , sqlite3 = require('sqlite3').verbose()


function updatePort (req, data, admiral) {
  _portBasic(data.api_basic, admiral)
  _portMaterial(data.api_material, admiral)
  async.series([ updateShips(req, data.api_ship, admiral)
               , updateFleets(data.api_deck_port, admiral)
               , updateRepair(req, data.api_ndock, admiral)
               ])
  // clear battle panel
  if (admiral.client)
    io.to(admiral.client).emit('clear_battle')
  else
    io.emit('clear_battle')
}

function _portBasic (data, admiral) {
  var send = {}
    , newKeyForBasic = { 'api_level' : 'level'
                       , 'api_rank' : 'rank'
                       , 'api_experience' : 'exp'
                       , 'api_max_chara' : 'max_ship'
                       , 'api_max_slotitem' : 'max_equipment'
                       , 'api_count_deck' : 'fleet_count'
                       , 'api_count_ndock' : 'repair_dock_count'
                       , 'api_count_kdock' : 'build_dock_count'
                       , 'api_nickname' : 'name'
                       }

  for (key in newKeyForBasic)
    send[newKeyForBasic[key]] = data[key]

  if (!admiral.memberId) {
    send.mix_id = data.api_member_id + data.api_nickname_id
    admiral.memberId = data.api_member_id
    admiral.nicknameId = data.api_nickname_id
    if (!fs.existsSync(admiral.getDataDir())) {
      fs.mkdirSync(admiral.getDataDir())
    }
    admiral.initDatabase()
  }

  io.emit('basic_update', send)
}

function _portMaterial (data, admiral) {
  var send = {}
  for (i in data) {
    send[data[i].api_id.toString()] = data[i].api_value
  }
  if (admiral.client)
    io.to(admiral.client).emit('material_update', send)
  else
    io.emit('material_update', send)
}

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
          if (admiral.equipment[slot[0]]) {
            var item = gameData.equipment[admiral.equipment[slot[0]].item_id]
            if (isBattleAircraft(item))
              shipAA += Math.floor(Math.sqrt(slot[1])*item.anti_air)
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
        if (admiral.equipment[slot]) {
          var item = gameData.equipment[admiral.equipment[slot].item_id]
          if (isReconAircraft(item)) {
            shipTra += item.tracking * 2
            otherTra -= item.tracking
          }
          else if (isRadar(item)) {
            shipTra += item.tracking
            otherTra -= item.tracking
          }
        }
        return shipTra
      }, 0)
    }, 0)
    return Math.floor(planeAndRadar + Math.sqrt(otherTra))
}

module.exports.handler = function (socket) {
  io = socket
  updateRepair =require('./update-repair').handler(io)
  updateShips = require('./update-ships')(io)
  return updatePort
}

module.exports.api = ['/api_port/port']
