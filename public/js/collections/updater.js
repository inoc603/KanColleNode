// collections/updater.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'models/updater'
  ]
, function($, _, Backbone, UpdaterModel){
    var UpdaterColleciton = Backbone.Collection.extend({
      model: UpdaterModel
    })
    return UpdaterColleciton
  }
)
