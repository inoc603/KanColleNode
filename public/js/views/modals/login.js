// login.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/modals/login.html'
  , 'collections/modal'
  , 'apps/common/service'
  , 'hashes'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, loginModalTpl, ModalCollection, service
           , Hashes) {
    var modalCollection = new ModalCollection()
    var loginModalView = Backbone.View.extend({
      el: '#modals',
      events: {
        'show.bs.modal #login-modal': 'reloadVerifyCode'
      , 'click #confirm-login': 'startLogin'
      },
      initialize: function () {
        var SHA1 = new Hashes.SHA1
        console.log(SHA1.hex('hello world'))
        this.render()
      },
      render: function(){
        var compiledTemplate = _.template(loginModalTpl)
        $(this.el).append( compiledTemplate )
      },
      reloadVerifyCode: function () {
        service.user.getVerifyCode('#login-verify-code')
      }
    , verifyPassword: function () {
        var $modal = $('#login-modal')
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
    , startLogin: function () {
        var $modal = $('#login-modal')
          , password = $('#input-login-password', $modal).val()
          , username = $('#input-login-username', $modal).val()
          , verifyCode = $('#input-login-verify-code', $modal).val()

        password = new Hashes.SHA1().hex(password)

        var send = { user: username
                   , passwd: password
                   , check: verifyCode
                   , guestinfo: $('#os-info').text()
                   }
        console.log(send)
        service.user.login(send, function (res) {
          console.log(res)
        })
      }
    , anomynousLogin: function () {

      }
    })
    return loginModalView
  }
)
