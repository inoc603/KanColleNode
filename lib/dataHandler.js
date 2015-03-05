var dataHandler = new Object();

var handlers = {
	'/api_port/port' : update_port
};

var io = null;

dataHandler.process = function(rawBody, api) {
	if (rawBody.slice(0, 7) == 'svdata=') {
		var bodyJson = JSON.parse(rawBody.slice(7));
		if (bodyJson['api_result'] = 1) {
			data = bodyJson['api_data'];
			console.log(Object.keys(handlers));
			if (api in handlers) {
				io.emit('news', 'handlingg data');
				handlers[api](data);
			}
			else {
				console.log('no handler for api');
			}
		}
		else {
			console.log('kancolle server error');
		}
	}
	else {
		console.log('wrong data content');
	};
};

function update_port (data) {
	console.log(data['api_basic']['api_nickname']);
	io.emit('port_update', JSON.stringify(data));

}

module.exports = function (socket) {
	io = socket;
	return dataHandler;
};