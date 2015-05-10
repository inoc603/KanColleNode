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
        // $('.selectpicker.select-wide').selectpicker({size: 5})
        // $('.selectpicker.select-narrow').selectpicker({width: '50px'})
        $('.selectpicker').selectpicker()
        // $('button[title="Nothing selected"]>span:first').text('请更新舰娘列表')
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
      }
    })
    return fleetPanelView
  }
)
