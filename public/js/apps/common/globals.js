// globals.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'apps/common/user'
  ]
, function ($, _, Backbone, User){
    var globals = {}
    globals.fleets = []
    globals.user = new User()
    // globals.user.code = '0cda04729ea6ed99f6b72b17c8559758a107f110'

    return globals
  }
)
