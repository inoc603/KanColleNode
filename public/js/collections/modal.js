// collections/modal.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'models/modal'
  ]
, function($, _, Backbone, ModalModel){
    var BlockCollection = Backbone.Collection.extend({
      model: ModalModel
    })
    return BlockCollection
  }
)
