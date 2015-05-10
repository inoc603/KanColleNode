// apps/updater/quest.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'collections/updater'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, UpdaterCollection, socket){
    var questUpdater = {
      initialize: function () {
        this.collection = new UpdaterCollection()
        this.collection.add({name: 'quest'})

      }
    }
    return questUpdater
  }
)