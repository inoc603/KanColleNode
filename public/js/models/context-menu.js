// models/context-menu.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var ContextMenuModel = Backbone.Model.extend({
      name: 'context'
    })
    return ContextMenuModel
  }
)
