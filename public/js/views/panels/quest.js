// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/quest.html'
  , 'apps/updaters/quest'
  ]
, function ( $, _, Backbone, questTpl, questUpdater) {
    var questPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'quest'
                                         , title:'任务'
                                         , template: questTpl})
        this.model.render(display)
        questUpdater.initialize()
      }
    })
    return questPanelView
  }
)
