// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/timers.html'
  , 'apps/updaters/timers'
  ]
, function ( $, _, Backbone, timersTpl, timersUpdater) {
    var timersPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'timers'
                                         , title:'综合'
                                         , template: timersTpl})
        this.model.render(display)
        timersUpdater.initialize()
      }
    })
    return timersPanelView
  }
)
