var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , newKey = { 'api_id': 'id'
             , 'api_slotitem_id': 'item_id'
             , 'api_locked': 'locked'
             , 'api_level': 'level'
             }

function slotSet (req, data, admiral) {
  console.log(data)

}

module.exports.handler = function (socket) {
  io = socket
  return slotSet
}

module.exports.api = ['/api_req_kaisou/slotset']
