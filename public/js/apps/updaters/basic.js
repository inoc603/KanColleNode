// apps/updater/basic.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  , 'apps/common/globals'
  ]
, function($, _, Backbone, UpdaterCollection, socket, globals){
    var basicUpdater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'basic'})
        console.log(socket)
        socket.on('basic_update', function (data) {
          console.log(data)
          if (data.mix_id)
            globals.mixId = data.mix_id
        })

      }
    }
    return basicUpdater
  }
)
