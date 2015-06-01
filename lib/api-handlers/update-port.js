var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , updateFleets = function () {}
  , updateBasic = function () {}
  , fs = require('fs')

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

module.exports.handler = function (socket) {
  io = socket
  updateRepair =require('./update-repair').handler(io)
  updateShips = require('./update-ships')(io)
  updateFleets = require('./update-fleets')(io)
  updateBasic = require('./get-basic').handler(io)
  return updatePort
}

module.exports.api = ['/api_port/port']
