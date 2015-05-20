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
    , updateShipList: function () {
        console.log('update ship list')
      }
    , caulculate: function () {

      }
    })
    return fleetPanelView
  }
)

var levelExp = [ 0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500
             , 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300
             , 17100, 19000, 21000, 23100, 25300, 27600, 30000, 32500
             , 35100, 37800, 40600, 43500, 46500, 49600, 52800, 56100
             , 59500, 63000, 66600, 70300, 74100, 78000, 82000, 86100
             , 90300, 94600, 99000, 103500, 108100, 112800, 117600
             , 122500, 127500, 132700, 138100, 143700, 149500, 155500
             , 161700, 168100, 174700, 181500, 188500, 195800, 203400
             , 211300, 219500, 228000, 236800, 245900, 255300, 265000
             , 275000, 285400, 296200, 307400, 319000, 331000, 343400
             , 356200, 369400, 383000, 397000, 411500, 426500, 442000
             , 458000, 474500, 491500, 509000, 527000, 545500, 564500
             , 584500, 606500, 631500, 661500, 701500, 761500, 851500
             , 1000000, 1000000, 1010000, 1011000, 1013000, 1016000
             , 1020000, 1025000, 1031000, 1038000, 1046000, 1055000
             , 1065000, 1077000, 1091000, 1107000, 1125000, 1145000
             , 1168000, 1194000, 1223000, 1255000, 1290000, 1329000
             , 1372000, 1419000, 1470000, 1525000, 1584000, 1647000
             , 1714000, 1785000, 1860000, 1940000, 2025000, 2115000
             , 2210000, 2310000, 2415000, 2525000, 2640000, 2760000
             , 2887000, 3021000, 3162000, 3310000, 3465000, 3628000
             , 3799000, 3978000, 4165000, 4360000
             ]
, mapExp = [ [30,50,80,100,150]
           , [120,150,200,300,250]
           , [310,320,330,350,400]
           , [310,320,330,340]
           , [360,380,400,420,450]
           , [380,420]
           ]
, rankFactor = { 's': 1.2
               , 'a': 1
               , 'b': 1
               , 'c': 0.8
               , 'd': 0.7
               }

function invokeCalculate () {
  $('span#one_turn').trigger('calculate')
  $('span#turns_left').trigger('calculate')
}
