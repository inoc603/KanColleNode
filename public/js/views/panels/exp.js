// exp.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/exp.html'
  , 'apps/updaters/fleet'
  , 'bootstrap-select'
  , 'bootstrap-formhelpers'
  ]
, function ( $, _, Backbone, expTpl, fleetUpdater) {
    var fleetPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'exp'
                                         , title:'经验'
                                         , template: expTpl})
        this.model.render(display)
        fleetUpdater.initialize()
      }
    })
    return fleetPanelView
  }
)
