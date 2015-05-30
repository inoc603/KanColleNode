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

    return globals
  }
)
