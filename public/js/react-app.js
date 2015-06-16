define(
  [ 'jquery'
  , 'underscore'
  , 'es6!react-component/test'
  , 'jsx!react-component/title-bar'
  , 'jsx!react-component/blocks/info'
  ]
, function ($, _) {
    // require('react/test')
    var test = require('es6!react-component/test')
    var tb = require('react-component/title-bar')
    var infoBlock = require('jsx!react-component/blocks/info')

    var app = {}
    app.initialize = function () {
      // console.log('HELLO')
      // test.init()
      // console.log(test)
      test.testView.init()
      // tb.initialize()
      // infoBlock.initialize()
    }
    return app
  }
)
