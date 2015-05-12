// app.js
define([ 'jquery'
       , 'underscore'
       , 'views/title-bar'
       , 'views/blocks/info'
       // , 'views/context-menus/pill'
       , 'jquery.ui'
       , 'bootstrap'
       ]
, function ($, _, TitlebarView, InfoBlockView, PillMenuView) {
    var modes = { 'game': ['desktop']
                , 'titlebar': ['desktop', 'desktop-no-game']
                }
    var initialize = function () {
      var mode = $('#app-mode').text()
        , titlebarView
        , infoBlockView

      // load title bar for nw.js if it's used
      if (_.contains(modes.titlebar, mode)) {
        titlebarView = new TitlebarView()
        $('body').css('margin-top', '50px')
                 .css('overflow', 'hidden')
      }

      // load the info block
      var infoBlockView = new InfoBlockView()
      $('#main-container').css('height', '100%')

      // add
      // var pillContextMenuView = new PillMenuView()

    }
    return { initialize: initialize }
  }
)
