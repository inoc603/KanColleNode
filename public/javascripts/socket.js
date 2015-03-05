var socket = io.connect('http://localhost:3000');

socket.on('test_good', function (data) {
	// socket.emit('my other event', { my: 'data' });
	// alert('get!');
});

socket.on('news', function (data) {
	alert('data');
	// socket.emit('test', {message : '1'});
	// alert('test sent');
});

socket.on('port_update', function (data) {
	$('textarea#debug').append(data.toString()+'\n');
});

socket.on('basic_update', function (data) {
	
});