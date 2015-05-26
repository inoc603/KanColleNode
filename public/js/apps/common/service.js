define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var service = {}
      , host = 'api.aghost.cn'

      , user = {}
      , data = {}

    user.path = '/api/user'

    user.login = function (username, password) {

    }

    user.checkName = function (username, callback) {
      var endpoint = '/checkname'
        , protocol = 'http://'
        , url = protocol + host + this.path + endpoint

      $.get(url, {user: username}, function (data) {
        // console.log(data)
        if (typeof callback == 'function') callback(data)
      })
    }

    user.getToken = function () {

    }

    user.register = function (options) {
      var endpoint = '/login'
        , protocol = 'htpp://'
        , url = protocol + host + this.path + endpoint

      $.post(url, options, function (data) {
        console.log(data)
      })
    }

    user.anomynous = function () {

    }

    user.getVerifyCode = function (imgSelector) {
      var protocol = 'http://'
        , endpoint = '/verifycode'
        , url = protocol + host + this.path + endpoint
      // $.get(url, function (data) {
      //   // console.log(data)
      //   $('#verify').attr
      // })
      $(imgSelector).attr('src', url)
    }

    service.user = user

    return service
  }
)
