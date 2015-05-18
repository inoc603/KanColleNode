var io = null

function updateRepair (req, data, admiral) {
  admiral.repairDock = {}
  for (var i in data) {
    admiral.repairDock[data[i].api_id] = {}
    temp = admiral.repairDock[data[i].api_id]
    switch (data[i].api_state) {
      case 1:
        temp.state = 'occupied'
        temp.ship = admiral.ships[data[i].api_ship_id]
        temp.ship_id = data[i].api_ship_id
        temp.complete_time = data[i].api_complete_time
        break;
      case 0:
        temp.state = 'empty'
        break;
      case -1:
        temp.state = 'locked'
        break;
    }
  }

  if (admiral.client)
    io.to(admiral.client).emit('repair_update', admiral.repairDock)
  else
    io.emit('repair_update', admiral.repairDock)
}

module.exports.handler = function (socket) {
  io = socket
  return updateRepair
}

module.exports.api = ['/api_get_member/ndock']