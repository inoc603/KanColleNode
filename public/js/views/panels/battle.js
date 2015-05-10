// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/battle.html'
  , 'apps/updaters/fleet'
  ]
, function ( $, _, Backbone, battleTpl, fleetUpdater) {
    var fleetPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'battle'
                                         , title:'出击'
                                         , template: battleTpl})
        this.model.render(display)
        fleetUpdater.initialize()
      }
    })
    return fleetPanelView
  }
)
