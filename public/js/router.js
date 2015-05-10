// router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/title-bar'
], function($, _, Backbone, TitlebarView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '/titlebar': 'showTitlebar',

      // Default
      '*actions': 'defaultAction'
    }
  })

  var initialize = function(){
    var app_router = new AppRouter
    app_router.on('showTitlebar', function(){

      var projectListView = new TitlebarView()
      projectListView.render()
    })

    app_router.on('defaultAction', function(actions){
      console.log('No route:', actions)
    })
    Backbone.history.start()
  }
  return {
    initialize: initialize
  }
})