require.config(
{ paths: { 'jquery': 'vendor/jquery'
         , 'underscore': 'vendor/underscore'
         , 'bootstrap': 'vendor/bootstrap'
         , 'jquery.ui': 'vendor/jquery-ui'
         , 'backbone': 'vendor/backbone'
         , 'text': 'vendor/text'
         , 'socket.io': '../socket.io/socket.io'
         , 'bootstrap-contextmenu': 'vendor/bootstrap-contextmenu'
         , 'bootstrap-select': 'vendor/bootstrap-select'
         , 'bootstrap-formhelpers': 'vendor/bootstrap-formhelpers'
         , 'datatables': 'vendor/jquery.dataTables'
         , 'bootstrap-touchspin': 'vendor/jquery.bootstrap-touchspin'
         , 'conflict': 'apps/common/conflict'
         , 'dynatable': 'vendor/jquery.dynatable'
         , 'hashes': 'vendor/hashes'
         , 'react': 'vendor/react'
         , 'JSXTransformer': 'vendor/JSXTransformer'
         , 'jsx': 'vendor/jsx'
         , 'react-bs': 'vendor/react-bootstrap'
         , 'es6': "vendor/es6"
         , 'babel': "vendor/babel-4.6.6.min"
         }
, shim: { 'socket.io': { exports: 'io' }
        , 'bootstrap': ['jquery']
        , 'jquery.ui': ['jquery', 'conflict']
        , 'conflict': ['bootstrap']
        , 'bootstrap-select': ['jquery']
        , 'bootstrap-formhelpers': ['jquery']
        , 'jsx': ['JSXTransformer']
        // , 'data-tables': ['jquery']
        // , 'models/share': {exports: 'ShareFleet'}
        }
, config: {
    jsx: {
      fileExtension: ".jsx",
      transformOptions: {
        harmony: true,
        stripTypes: false,
        inlineSourceMap: true
      },
      usePragma: false
    }
  }
})

require(['react-app'], function (app) {
  app.initialize()
})
