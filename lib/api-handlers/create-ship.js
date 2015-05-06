var io = null
  , gameData = require('../game-data')

function createShip (req, data, admiral) {
  var d = new Date()
  param = { 'time': d.toLocaleTimeString()
          , 'date': d.toLocaleDateString()
          , 'dock': req.api_kdock_id
          , 'is_large': (req.api_large_flag==1)
          , 'fuel': req.api_item1
          , 'ammo': req.api_item2
          , 'steel': req.api_item3
          , 'aluminium': req.api_item4
          , 'material': req.api_item5
          , 'is_complete': false
          }

  if (admiral.db)
    admiral.insertBuildShip(param)
}

module.exports.handler = function (socket) {
  io = socket
  return createShip
}

module.exports.api = ['/api_req_kousyou/createship']