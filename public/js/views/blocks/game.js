// info-block.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/blocks/game.html'
  , 'collections/panel'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, gameBlockTpl, PanelCollection) {
    var panelCollection = new PanelCollection()
    var InfoBlockView = Backbone.View.extend({
      el: $('#game-container'),
      initialize: function () {
        $.when(this.render())
         .then(function () {
            var gameSrc="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/"
            $("#refresh-game").click(function () {
              $("#game-frame").attr("src", gameSrc)
              $('#game-panel>.panel-heading').hide()
            })
          })
      },
      render: function(){
        var compiledTemplate = _.template(gameBlockTpl)
        this.$el.append( compiledTemplate )
      }
    })
    return InfoBlockView
  }
)
