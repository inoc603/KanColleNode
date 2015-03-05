var express = require('express');
var http = require('http');

var io = null;
var dataHandler = null;

var router = express.Router();


// headers need to be changed into case-sensitive ones
var sensitive = [
	'Second-Send-Url', 'Accept', 'Accept-Language',	'User-Agent',
	'Host', 'Content-Type', 'X-Requested-With', 'Origin',
	'Referer', 'Content-Length', 'Accept-Encoding'
];

router.all('/*', function(req, res) {
	// console.log('url: ', req.url);
	// var url = req.url.replace('localhost.', '127.0.0.1');

	// Construct options for proxy request
	var option = {};
	option.hostname = req.hostname.replace('localhost.', '127.0.0.1');
	option.port = req._parsedUrl.port;
	option.path = req._parsedUrl.pathname;
	option.headers = req.headers;
	option.headers.host = option.headers.host.replace('localhost.', 
		'127.0.0.1');
	option.method = req.method;

	// replace the lowercase header keys with case-sesitive ones
	// in order to be recognized by the KanColle server.
	var hkeys = Object.keys(option.headers);
	for (var i = 0; i < sensitive.length; i++) {
		j = hkeys.indexOf(sensitive[i].toLowerCase());
		if ( j != -1) {
			hkeys[j] = sensitive[i];
		};
	};
	for (var i = 0; i < hkeys.length; i++) {
		option.headers[hkeys[i]] = 
			option.headers[hkeys[i].toLowerCase()];
		delete option.headers[hkeys[i].toLowerCase()];
	};

	var proxyRes = http.request(option);

	proxyRes
		.on('response', function (resp) {
			resp.pipe(res, {end:true});
			resp.body = "";
			resp.on('data', function (chunk) {
					resp.body += chunk;
			});
			resp.on('end', function () {
					// console.log(resp.body);
					// analyze the response now
					console.log('api:', req._parsedUrl.pathname);
					dataHandler.process(resp.body, req._parsedUrl.pathname);
					// io.emit('news', 'data get');
			});
		})
		.on('error', function (err) {
			console.log(err);
		});

	proxyRes.write(req.body);
	proxyRes.end();

});

module.exports = function (socket) {
	io = socket;
	dataHandler = require('../lib/dataHandler')(io);
	return router;
};