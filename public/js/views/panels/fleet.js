// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/fleet.html'
  , 'apps/updaters/fleet'
  ]
, function ( $, _, Backbone, fleetTpl, fleetUpdater) {
    var fleetPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'fleet'
                                         , title:'舰队'
                                         , template: fleetTpl})
        this.model.render(display)
        fleetUpdater.initialize()
      }
    })
    return fleetPanelView
  }
)
