// collections/panel.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'models/panel'
  ]
, function($, _, Backbone, PanelModel){
    var PanelCollection = Backbone.Collection.extend({
      model: PanelModel
    })
    return PanelCollection
  }
)
