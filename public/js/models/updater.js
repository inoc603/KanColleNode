// models/updater.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'apps/common/socket'
  ]
, function($, _, Backbone, socket){
    var UpdaterModel = Backbone.Model.extend(
      { name: 'updater'}
    )
    return UpdaterModel
  }
)
