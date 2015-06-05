// login.js
define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'text!templates/modals/login.html'
  , 'collections/modal'
  , 'apps/common/service'
  , 'apps/common/globals'
  , 'hashes'
  , 'jquery.ui'
  ]
, function ( $, _, Backbone, loginModalTpl, ModalCollection, service
           , globals, Hashes) {
    var modalCollection = new ModalCollection()
    var loginModalView = Backbone.View.extend({
      el: '#modals'
    , events: {
        'show.bs.modal #login-modal': 'reloadVerifyCode'
      , 'click #confirm-login': 'startLogin'
      , 'change #input-login-anonymous': 'changeAnonmynus'
      }
    , initialize: function () {
        var SHA1 = new Hashes.SHA1
        this.render()
      }
    , render: function(){
        var compiledTemplate = _.template(loginModalTpl)
        $(this.el).append( compiledTemplate )
      }
    , reloadVerifyCode: function () {
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
          , anonymous = $('#input-login-anonymous').is(':checked')

        if (anonymous) {
          console.log('anonymous')
          var verifyCode = $('#input-login-verify-code', $modal).val()
            , guestinfo = $('#os-info').text()
            , send = { check: verifyCode
                     , guestinfo: guestinfo}
          // service.user.anonymousLogin(send)
          globals.user.anonymousLogin(send, function (res) {
            console.log(res)
          })
        }
        else {
          var password = $('#input-login-password', $modal).val()
            , username = $('#input-login-username', $modal).val()
            , verifyCode = $('#input-login-verify-code', $modal).val()
            , remember = $('#input-remember-me', $modal).is(':checked')

          password = new Hashes.SHA1().hex(password)

          var send = { user: username
                     , passwd: password
                     , check: verifyCode
                     , guestinfo: $('#os-info').text()
                     }
          console.log(send)

          globals.user.login(send, function (res) {
            // console.log(res)
          })
        }

      }
    , anonymousLogin: function () {
        var osInfoReg = /\((\S+)\)\((\S+)\)\((\S+)\)\((\S+)\)/
          , osInfoStr = $('#os-info').text()
          , osInfo = _.rest(osInfoStr.match(osInfoReg))

        service.user.anonymousLogin()
      }
    , changeAnonmynus: function () {
        if ($('#input-login-anonymous').is(':checked')) {
          $('#input-login-username').attr('disabled', true)
          $('#input-login-password').attr('disabled', true)
          $('#input-remember-me').attr('disabled', true)
        }
        else {
          $('#input-login-username').attr('disabled', false)
          $('#input-login-password').attr('disabled', false)
          $('#input-remember-me').attr('disabled', false)
        }
      }
    })
    return loginModalView
  }
)
