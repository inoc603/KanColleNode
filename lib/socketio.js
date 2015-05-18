/*
 * Module exports a socket.io instance for pushing data to the
 * client.
*/

var Admiral = require('./admiral')
  , adFinder = new Admiral('finder')
  // , socktio = require('socket.io')

var io = null;

module.exports = function (server) {
  io = require('socket.io')(server);
  io
  .on('connection', function (socket) {
    // console.log('connected');
    // socket.emit('ready_to_bind', null)

    socket.on('error', function (err) {
      console.log(err)
    })

    socket.on('join', function () {
      console.log('join')
    })

    socket.on('bind_listener', function (data) {
      console.log('binding ' + data.listener_num)
      console.log(data)
      console.log(socket.id)
      // io.join(data.listener_num.toString())
      var ad = adFinder.findByMixId(data.mix_id)
      ad.client = socket.id
      io.to(ad.client).emit('bind_success')
    })

    socket.on('disconnect', function () {
      console.log('disconnect');
    });
  })
  return io;
}