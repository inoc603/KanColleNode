// register.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/modals/register.html'
  , 'collections/modal'
  , 'apps/common/service'
  , 'hashes'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, registerModalTpl, ModalCollection, service
           , Hashes) {
    var modalCollection = new ModalCollection()
    var registerModalView = Backbone.View.extend({
      el: '#modals',
      events: {
        'show.bs.modal #register-modal': 'reloadVerifyCode'
      , 'change #input-username': 'checkUsername'
      , 'change #input-password': 'verifyPassword'
      , 'change #input-confirm-password' : 'confirmPassword'
      , 'click #confirm-register': 'startRegister'
      , 'change #input-email': 'verifyEmail'
      },
      initialize: function () {
        var SHA1 = new Hashes.SHA1
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
    , confirmPassword: function () {
        var $modal = $('#register-modal')
            , password = $('#input-password', $modal).val()
            , confirmPassword = $('#input-confirm-password', $modal).val()
        if (password == confirmPassword) {
          $('#input-confirm-password', $modal).parent().parent()
              .attr('class', 'form-group has-success')
        }
        else {
          $('#input-confirm-password', $modal).parent().parent()
              .attr('class', 'form-group has-error')
        }
      }
    , startRegister: function () {
        var $modal = $('#register-modal')
          , password = $('#input-password', $modal).val()
          , username = $('#input-username', $modal).val()
          , email = $('#input-email', $modal).val()
          , verifyCode = $('#input-verify-code', $modal).val()

        password = new Hashes.SHA1().hex(password)

        var send = { user: username
                   , passwd: password
                   , email: email
                   , check: verifyCode
                   }
        console.log(send)
        service.user.register(send, function (res) {
          console.log(res)
        })
      }
    , verifyEmail: function () {
        var $modal = $('#register-modal')
          , email = $('#input-email', $modal).val()
          , re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

        if (re.test(email)) {
          $('#input-email', $modal).parent().parent()
              .attr('class', 'form-group has-success')
        }
        else {
          $('#input-email', $modal).parent().parent()
              .attr('class', 'form-group has-error')
        }
      }
    })
    return registerModalView
  }
)
