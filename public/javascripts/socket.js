var socket = io.connect('http://localhost:3000')

socket.on('bind_success', function (data) {
  alert('bind successful')
})

socket.on('ready_to_bind', function (data) {
  socket.emit('bind_listener', listener_num)
})

socket.on('news', function (data) {
  // alert('data');
  // socket.emit('test', {message : '1'});
  // alert('test sent');
})

socket.on('port_update', function (data) {
  $('textarea#debug').append(data.toString()+'\n')
})

socket.on('basic_update', function (data) {
  update_basic(data)
  if (!is_bind_to_admiral) {
    socket.emit('bind_listener', {
      'listener_num' : listener_num,
      'mix_id' : data['mix_id']
    })
  }
})

socket.on('material_update', function (data) {
  update_material(data)
})