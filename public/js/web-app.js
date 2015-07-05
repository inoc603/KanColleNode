// app.js
define([ 'jquery'
       , 'underscore'
       , 'views/blocks/info'
       , 'views/blocks/game'
       , 'apps/updaters/basic'
       // , 'views/context-menus/pill'
       , 'views/modals/register'
       , 'views/modals/login'
       , 'apps/common/user'

       , 'jquery.ui'
       , 'bootstrap'


       ]
, function ( $, _, InfoBlockView, GameBlockView, basicUpdater
           , RegisterView, LoginView, User) {
    var modes = { 'game': ['desktop', 'game-only']
                , 'titlebar': ['desktop', 'desktop-no-game', 'game-only']
                , 'info': ['desktop', 'desktop-no-game']
                }
    var initialize = function () {
      var mode = $('#app-mode').text()

      // load the info block
      if (_.contains(modes.info, mode)) {
        var infoBlockView = new InfoBlockView()
        $('#main-container').css('height', '100%')
      }

      if (_.contains(modes.game, mode)) {
        var gameBlockView = new GameBlockView(true)
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
