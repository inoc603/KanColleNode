// info-block.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/blocks/info.html'
  , 'collections/panel'
  , 'views/panels/fleet'
  , 'views/panels/timers'
  , 'views/panels/quest'
  , 'views/panels/battle'
  , 'views/panels/exp'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, infoBlockTemplate, PanelCollection
           , FleetView, TimersView, QuestView, BattleView, ExpView) {
    var panelCollection = new PanelCollection()
    var InfoBlockView = Backbone.View.extend({
      el: $('#main-container'),
      initialize: function () {
        $.when(this.render())
         .then(function () {
            console.log('render finish')
            // load panels
            var fleetView = new FleetView(true, panelCollection)
              , timersView = new TimersView(true, panelCollection)
              , questView = new QuestView(true, panelCollection)
              , battleView = new BattleView(true, panelCollection)
              , exoView = new ExpView(true, panelCollection)

            // set fleet view as default view
            $('#fleet-pill').addClass('active')
            $('a[href=#fleet-pill]').parent().addClass('active')

            // make the pills sortable
            $('.nav-pills').sortable({ revert: true
                                     , containment: '.nav-pills'})
          })
         .then(function () {
            // set up add pill menu
            $('li' ,$('#add-pill').next()).click(function () {
              var panelName = $(this).attr('id').split('-')[0]
              panelCollection.where({name: panelName})[0].addTab(true)
              $(this).hide()
            })
          })
      },
      render: function(){
        var compiledTemplate = _.template(infoBlockTemplate)
        this.$el.append( compiledTemplate )
      }
    })
    return InfoBlockView
  }
)
