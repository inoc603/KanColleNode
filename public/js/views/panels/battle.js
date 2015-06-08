// battle.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/battle.html'
  , 'text!templates/panels/battle-table.html'
  , 'apps/updaters/battle'
  , 'apps/common/page-util'
  ]
, function ( $, _, Backbone, battleTpl, TabelTpl, battleUpdater, pageUtil) {
    var fleetPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection, pillMenuView) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'battle'
                                         , title:'出击'
                                         , template: battleTpl})
        $.when(this.model.render(display, globalCollection, pillMenuView))
         .then(this.render())

        battleUpdater.initialize()
      }
    , render: function () {
        var $panelBody = $('#battle-panel>.panel-body')
        // console.log($panelBody)
          , template = _.template(TabelTpl)
        $('#map-info', $panelBody)
          .after(template({id: 'combined'}))
          .after(template({id: 'friendly'}))
        $('#battle-info').after(template({id: 'enemy'}))
        pageUtil.hideBattleInfo()
      }
    })
    return fleetPanelView
  }
)
