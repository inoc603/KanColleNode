// socket.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'socket.io'
  ]
, function($, _, Backbone, io){
    var socket = io.connect('http://127.0.0.1:3001')
    socket.on('connect', function () {
      console.log('socket connected')
    })
    return socket
  }
)
