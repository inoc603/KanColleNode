var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , updateFleets = function () {}
  , fs = require('fs')
  // , sqlite3 = require('sqlite3').verbose()


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

module.exports.handler = function (socket) {
  io = socket
  updateRepair =require('./update-repair').handler(io)
  updateShips = require('./update-ships')(io)
  updateFleets = require('./update-fleets')(io)
  return updatePort
}

module.exports.api = ['/api_port/port']
