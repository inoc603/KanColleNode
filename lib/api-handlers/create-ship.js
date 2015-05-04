var io = null
  , gameData = require('../game-data')
  , time = new Date()

function createShip (req, data, admiral) {
  // updateBuild(req, data.api_kdock, admiral)
  param = { '$time': time.toLocaleString()
          , '$dock': req.api_kdock_id
          , '$is_large': (req.api_large_flag==1)
          , '$fuel': req.api_item1
          , '$ammo': req.api_item2
          , '$steel': req.api_item3
          , '$aluminium': req.api_item4
          , '$material': req.api_item5
          }
  admiral.db.serialize(function () {
    this.run(
      'INSERT INTO '
      +'build_log( time, dock, is_large, fuel, ammo'
      +         ', steel, aluminium, material) '
      +'VALUES ( $time, $dock, $is_large, $fuel, $ammo'
      +       ', $steel, $aluminium, $material)'
      , param
    )
    this.all('SELECT * FROM build_log', function (err, rows) {
      console.log(rows)
    })
  })
}

module.exports.handler = function (socket) {
  io = socket
  return createShip
}

module.exports.api = ['/api_req_kousyou/createship']