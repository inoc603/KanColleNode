var io = null
  , gameData = require('../game-data')
  , async = require('async')
  , _ = require('underscore')
  , updateShips = function () {}
  , updateFleets = function () {}
  , fs = require('fs')

var updateShipAfterBattle = function (req, data, admiral) {
  async.series([updateShips(req, data.api_ship_data, admiral, true)
               ,updateFleets(data.api_deck_data, admiral)])

}

module.exports.handler = function (socket) {
  io = socket
  updateShips = require('./update-ships')(io)
  updateFleets = require('./update-fleets')(io)
  return updateShipAfterBattle
}

module.exports.api = ['/api_get_member/ship_deck']
