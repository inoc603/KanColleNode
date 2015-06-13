var io = require('../globals').io
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = require('./update-ships')
  , updateFleets = require('./update-fleets')
  , updateBasic = require('./update-basic')
  , updateRepair = function () {

  }
  , fs = require('fs')
  , traffic = require('../globals').dataHandler.emitter

function updatePort (req, data, admiral) {
  console.log('update port')
  updateBasic(req, data.api_basic, admiral)
  _portMaterial(data.api_material, admiral)
  async.series([ updateShips(req, data.api_ship, admiral)
               , updateFleets(data.api_deck_port, admiral)
               , updateRepair(req, data.api_ndock, admiral)
               ])
  if (admiral.client)
    io.to(admiral.client).emit('clear_battle')
  else
    io.emit('clear_battle')
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

traffic.on('/api_port/port', updatePort)

module.exports = true
