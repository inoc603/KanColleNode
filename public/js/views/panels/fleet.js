// fleet.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/fleet.html'
  , 'apps/updaters/fleet'
  , 'bootstrap'
  ]
, function ( $, _, Backbone, fleetTpl, fleetUpdater) {
    var fleetPanelView = Backbone.View.extend({
      el: '#info-block'
    , events: {
        'click #save-fleet': 'saveFleet'
      , 'shown.bs.tab #tab-fleet a[data-toggle="tab"]': 'swapFooter'
      , 'shown.bs.tab .fleet-tab a[data-toggle="tab"]': 'swapFleetName'
      , 'click .fleet-table>tbody': 'swapDisplay'
      }
    , initialize: function (display, globalCollection) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'fleet'
                                         , title:'舰队'
                                         , template: fleetTpl})
        this.model.render(display)
        fleetUpdater.initialize()
        this.setupAnimation()
      }
    , setupAnimation: function () {
        $('#save-fleet').bstooltip()
      }
    , saveFleet: function () {
        console.log('save')
      }
    , swapFooter: function (e) {
        var target = $(e.target).attr("href")
          , fleetNum = parseInt(target[target.length-1])
          $('.fleet-footer').hide()
        $footer = $('#fleet-footer-'+target[target.length-1])
        $footer.show()
      }
    , swapFleetName: function (e) {
        $('span:last-child', $(e.target)).attr('class', 'fleet-name-shown')
        $('span:last-child', $(e.relatedTarget)).attr( 'class'
                                                     , 'fleet-name-hidden')
      }
    , swapDisplay: function () {
        $('.fleet-table .ship-health').parent().toggleClass('hidden-td')
        $('.fleet-table .ship-condition').toggleClass('hidden-td')
        $('.fleet-table .ship-equipment').toggleClass('hidden-td')
      }
    })
    return fleetPanelView
  }
)
