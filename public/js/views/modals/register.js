// register.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/modals/register.html'
  , 'collections/modal'
  , 'apps/common/service'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, registerModalTpl, ModalCollection, service) {
    var modalCollection = new ModalCollection()
    var registerModalView = Backbone.View.extend({
      el: '#modals',
      events: {
        'show.bs.modal #register-modal': 'reloadVerifyCode'
      , 'change #input-username': 'checkUsername'
      , 'change #input-password': 'verifyPassword'
      , 'click #confirm-register': 'startRegister'
      },
      initialize: function () {
        this.render()
      },
      render: function(){
        var compiledTemplate = _.template(registerModalTpl)
        $(this.el).append( compiledTemplate )
      },
      reloadVerifyCode: function () {
        service.user.getVerifyCode('#register-verify-code')
      }
    , checkUsername: function () {
        var $modal = $('#register-modal')
        var username = $('#input-username', $modal).val()
        console.log(username)
        service.user.checkName(username, function (data) {
          console.log(data)
          if (data.errcode == 0) {
            $('#input-username', $modal).parent().parent()
              .attr('class', 'form-group has-success')
          }
          if (data.errcode == 10013) {
             $('#input-username', $modal).parent().parent()
              .attr('class', 'form-group has-error')
          }
        })
      }
    , verifyPassword: function () {
        var $modal = $('#register-modal')
          , password = $('#input-password', $modal).val()
        // console.log(password)
        if (password.length < 6) {
          $('#input-password', $modal).parent().parent()
            .attr('class', 'form-group has-error')
        }
        else {
          $('#input-password', $modal).parent().parent()
            .attr('class', 'form-group has-success')
        }
      }
    , startRegister: function () {
        console.log(navigator)
      }
    })
    return registerModalView
  }
)
