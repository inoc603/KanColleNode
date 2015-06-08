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
  , 'views/context-menus/pill'
  , 'views/panels/list'
  , 'views/panels/share-fleet'
  , 'views/panels/test'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, infoBlockTemplate, PanelCollection
           , FleetView, TimersView, QuestView, BattleView, ExpView
           , PillMenuView, ListView, ShareFleetView, TestView) {
    var panelCollection = new PanelCollection()
    var InfoBlockView = Backbone.View.extend({
      el: $('#main-container'),
      initialize: function () {
        var pillMenuView
        $.when(this.render())
         .then(function () {
            // console.log('render finish')
            // load panels
            pillMenuView = new PillMenuView()

            new FleetView(true, panelCollection, pillMenuView)
            new TimersView(true, panelCollection, pillMenuView)
            new QuestView(true, panelCollection, pillMenuView)
            new BattleView(true, panelCollection, pillMenuView)
            new ExpView(false, panelCollection, pillMenuView)
            new ListView(false, panelCollection, pillMenuView)
            new ShareFleetView(false, panelCollection, pillMenuView)
            new TestView(true, panelCollection, pillMenuView)

            // load plugin panels
            var plugins = $('#plugins').text().split(',')
            for (var i in plugins) {
              console.log(plugins[i])
              if (plugins[i] == '') continue
              require(['plugins/'+plugins+'/index'], function (PluginView) {
                new PluginView(false, panelCollection, pillMenuView)
              })
            }


            // set fleet view as default view
            $('#fleet-pill').addClass('active')
            $('a[href=#fleet-pill]').parent().addClass('active')

            // make the pills sortable
            $('.nav-pills').sortable({ revert: true
                                     , containment: '.nav-pills'})

            pillMenuView.bindEvent('#info-block>.nav li a')
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
