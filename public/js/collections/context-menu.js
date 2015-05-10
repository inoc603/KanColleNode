// collections/block.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'models/context-menu'
  ]
, function($, _, Backbone, ContextMenuModel){
    var ContextMenuCollection = Backbone.Collection.extend({
      model: ContextMenuModel
    })
    return ContextMenuCollection
  }
)
