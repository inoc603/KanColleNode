// exp.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/exp.html'
  , 'apps/updaters/fleet'
  , 'bootstrap-select'
  , 'bootstrap-formhelpers'
  , 'bootstrap-touchspin'
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
        this.addTouchSpin()
        $('.selectpicker').selectpicker()
      },

      addTouchSpin: function () {
        $('input#exp-now-level').TouchSpin({
          min: 1,
          max: 150,
          step: 1,
          decimals: 0,
          prefix: '当前',
          postfix: '级',
          maxboostedstep: 10
        })

        $('input#exp-target-level').TouchSpin({
          min: 1,
          max: 150,
          step: 1,
          decimals: 0,
          prefix: '目标',
          postfix: '级',
          maxboostedstep: 10
        })

        // $('input[type="checkbox"]').checkbox()
      }
    })
    return fleetPanelView
  }
)
