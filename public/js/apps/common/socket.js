// socket.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'socket.io'
  ]
, function($, _, Backbone, io){
  console.log(io.connect)
    var socket = io.connect('http://localhost:3001')
    socket.on('connect', function () {
      console.log('socket connected')
    })
    .on('error', function (err) {
      console.log(err)
    })
    return socket
  }
)
