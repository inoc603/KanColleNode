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
      events: {
        'click #close-window': 'closeWindow'
      , 'click #maximize-window': 'maximizeWindow'
      , 'click #refresh-window': 'refreshWindow'
      , 'click #minimize-window': 'minimizeWindow'
      , 'click #open-console': 'openConsole'
      },
      initialize: function () {
        this.render()
        this.maxed = false
        win.on('maximize', function () {
          $('#maximize-window>span').toggleClass( 'glyphicon-resize-full '
                                                + 'glyphicon-resize-small')
        })
        win.on('minimize', function () {
          $('#maximize-window>span').toggleClass( 'glyphicon-resize-full '
                                                + 'glyphicon-resize-small')
        })
      },
      render: function(){
        var data = {}
        var compiledTemplate = _.template( toolbarTemplate, data )
        this.$el.append( compiledTemplate )
      },
      minimizeWindow: function () {
        win.minimize()
      },
      closeWindow: function () {
        win.close()
      },
      maximizeWindow: function () {
        if ($('#maximize-window>span').hasClass('glyphicon-resize-full'))
          win.maximize()
        else
          win.unmaximize()
        // $('#maximize-window>span').toggleClass( 'glyphicon-resize-full '
        //                                       + 'glyphicon-resize-small')
      },
      refreshWindow: function () {
        win.reload()
      },
      openConsole: function () {
        win.showDevTools()
      }
    })
    // Our module now returns our view
    return ProjectListView
  }
)
