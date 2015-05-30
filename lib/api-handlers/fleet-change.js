var io = null

function fleetChange (req, data, admiral) {
  fleet = parseInt(req.api_id)
  index = parseInt(req.api_ship_idx)
  ship = req.api_ship_id

  if (index == -1)
    admiral.fleets[fleet - 1].ships = [admiral.fleets[fleet - 1].ships[0]]
  else if (ship == -1)
    admiral.fleets[fleet - 1].ships = admiral.fleets[fleet - 1].ships
                                             .splice(index, 1)
  else
    admiral.fleets[fleet - 1].ships[index] = admiral.ships[ship]



  if (admiral.client)
    io.to(admiral.client).emit('fleet_update', admiral.fleets)
  else
    io.emit('fleet_update', admiral.fleets)

}

module.exports.handler = function (socket) {
  io = socket
  return fleetChange
}
module.exports.api = ['/api_req_hensei/change']
