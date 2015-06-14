define(
  [ 'jquery'
  , 'underscore'
  , 'jsx!react-component/test'
  , 'jsx!react-component/title-bar'
  , 'jsx!react-component/blocks/info'
  ]
, function ($, _) {
    // require('react/test')
    var test = require('jsx!react-component/test')
    var tb = require('react-component/title-bar')
    var infoBlock = require('jsx!react-component/blocks/info')

    var app = {}
    app.initialize = function () {
      // console.log('HELLO')
      // test.initialize()
      tb.initialize()
      infoBlock.initialize()
    }
    return app
  }
)
