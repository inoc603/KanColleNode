// models/modal.js

define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var ModalModel = Backbone.Model.extend({
      name: 'modal'
    })

    ModalModel.prototype.render = function () {

    }
    return ModalModel
  }
)
