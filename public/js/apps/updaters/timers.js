// apps/updater/timers.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, UpdaterCollection, socket){
    var timersUpdater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'timers'})

      }
    }
    return timersUpdater
  }
)