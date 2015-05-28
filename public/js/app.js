// app.js
define([ 'jquery'
       , 'underscore'
       , 'views/title-bar'
       , 'views/blocks/info'
       , 'views/blocks/game'
       , 'apps/updaters/basic'
       // , 'views/context-menus/pill'
       , 'views/modals/register'
       , 'views/modals/login'
       , 'jquery.ui'
       , 'bootstrap'


       ]
, function ( $, _, TitlebarView, InfoBlockView, GameBlockView, basicUpdater
           , RegisterView, LoginView) {
    var modes = { 'game': ['desktop', 'game-only']
                , 'titlebar': ['desktop', 'desktop-no-game', 'game-only']
                , 'info': ['desktop', 'desktop-no-game']
                }
    var initialize = function () {
      var mode = $('#app-mode').text()

      // load title bar for nw.js if it's used
      if (_.contains(modes.titlebar, mode)) {
        var titlebarView = new TitlebarView()
        $('body').css('margin-top', '30px')
                 .css('overflow', 'hidden')
      }

      // load the info block
      if (_.contains(modes.info, mode)) {
        var infoBlockView = new InfoBlockView()
        $('#main-container').css('height', '100%')
      }

      if (_.contains(modes.game, mode)) {
        var gameBlockView = new GameBlockView()
        // $('#game-container')
      }

      var registerVire = new RegisterView()
        , loginView = new LoginView()

      basicUpdater.initialize()


      // add
      // var pillContextMenuView = new PillMenuView()

    }
    return { initialize: initialize }
  }
)
