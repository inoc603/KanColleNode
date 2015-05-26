// collections/block.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'models/block'
  ]
, function($, _, Backbone, BlockModel){
    var BlockCollection = Backbone.Collection.extend({
      model: BlockModel
    })
    return BlockCollection
  }
)
