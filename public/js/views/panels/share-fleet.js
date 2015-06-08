// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/share-fleet.html'
  , 'apps/common/globals'
  // , 'apps/updaters/shareFleet'
  ]
, function ( $, _, Backbone, shareFleetTpl, globals, shareFleetUpdater) {
    var ShareFleetView = Backbone.View.extend({
      el: '#info-block'
    , events: { 'click #get-share-fleet': 'shareFleet'}
    , initialize: function (display, globalCollection, pillMenuView) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'share-fleet'
                                         , title:'配置'
                                         , template: shareFleetTpl})
        this.model.render(display, globalCollection, pillMenuView)
        // shareFleetUpdater.initialize()
      }
    , shareFleet: function () {

      }
    })
    return ShareFleetView
  }
)
