/*
 * Module exports a socket.io instance for pushing data to the
 * client.
*/

var io = null;

module.exports = function (server) {
	io = require('socket.io')(server);
	io.on('connection', function (socket) {
	  console.log('connected');
		// socket.emit('news', { hello: 'world' });

	  socket.on('test', function (data) {
	    // console.log(data);
	    console.log('test: ', data);
	    // socket.emit('test_good', {message: 'bar'});
	    socket.join(data.message);
	    io.to(data.message).emit('test_good');
	  });

	  socket.on('disconnect', function () {
	    console.log('disconnect');
	  })
	});
	return io;
}