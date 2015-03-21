var socket = io.connect('http://localhost:3000')

socket.on('bind_success', function (data) {
  is_bind_to_admiral = true
})

socket.on('ready_to_bind', function (data) {
  socket.emit('bind_listener', listener_num)
})

socket.on('basic_update', function (data) {
  // update_basic(data)
  if (!is_bind_to_admiral)
    if (data['mix_id'])
      socket.emit('bind_listener', {
        'listener_num' : listener_num,
        'mix_id' : data['mix_id']
      })
})

socket.on('fleet_update', function (data) {
  updateFleet(data)
})

socket.on('repair_update', function (data) {
  console.log(data)
  updateRepair(data)
})

socket.on('material_update', function (data) {
  // update_material(data)
})