// used to test new api
var fs= require('fs')
  , io = null

var getExpedition = function (req, data, admiral) {
  io.emit('expedition', data)
}

module.exports.handler = function (socket) {
  io = socket
  return getExpedition
}

module.exports.api = ['/api_get_member/mission']
