// test panel
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/panels/test.html'
  , 'apps/common/service'
  ]
, function ( $, _, Backbone, testTpl, service ) {
    var testPanelView = Backbone.View.extend({
      initialize: function (display, globalCollection, pillMenuView) {
        this.collection = globalCollection
        this.model = this.collection.add({ name: 'test'
                                         , title:'测试'
                                         , template: testTpl})
        this.model.render(display, globalCollection, pillMenuView)
        this.render()
      }
    , el: '#info-block'
    , render: function () {
        $('#user-reg').click(function () {
          // console.log()
          $('#register-modal').modal('show')
        })
        $('#user-login').click(function () {
          $('#login-modal').modal('show')
        })
      }
    })
    return testPanelView
  }
)
