define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var service = {}
      , host = 'http://api.aghost.cn'

      , user = {}
      , ship = {}

    user.path = '/api/user'

    user.login = function (options) {
      // console.log(options)
      var endpoint = '/login'
        , url = host + this.path + endpoint

      $.post(url, options, function (data) {
        console.log(data)
      })
    }

    user.checkName = function (username, callback) {
      var endpoint = '/checkname'
        , url = host + this.path + endpoint

      $.get(url, {user: username}, function (data) {
        // console.log(data)
        if (typeof callback == 'function') callback(data)
      })
    }

    user.getToken = function () {

    }

    user.register = function (options, callback) {
      var endpoint = '/reg'
        , url = host + this.path + endpoint

      $.post(url, options, function (data) {
        console.log(data)
        if (typeof callback == 'function')
          callback(data)
      })
    }

    user.anomynous = function () {

    }

    user.getVerifyCode = function (imgSelector) {
      var endpoint = '/verifycode'
        , url = host + this.path + endpoint
      // $.get(url, function (data) {
      //   // console.log(data)
      //   $('#verify').attr
      // })
      $(imgSelector).attr('src', url)
    }

    ship.path = '/api/ship'
    ship.uploadShipGet = function (rec) {
      var endpoint = '/shipget'
        , url = host + this.path + endpoint

      $.post(url, rec, function (res) {
        console.log(res)
      })
    }

    service.user = user
    service.ship = ship

    return service
  }
)
