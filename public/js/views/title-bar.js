// title-bar.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/toolbar.html'
  ]
, function ($, _, Backbone, toolbarTemplate) {
    var ProjectListView = Backbone.View.extend({
      el: $('#title-bar'),
      initialize: function () {
        this.render()
      },
      render: function(){
        // Using Underscore we can compile our template with data
        var data = {}
        var compiledTemplate = _.template( toolbarTemplate, data )
        // Append our compiled template to this Views "el"
        this.$el.append( compiledTemplate )
      }
    })
    // Our module now returns our view
    return ProjectListView
  }
)
