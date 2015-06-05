define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'hashes'
  ]
, function ($, _, Backbone, Hashes){
    var service = {}
      , host = 'http://api.aghost.cn'
      , SHA1 = new Hashes.SHA1
      , user = {}
      , ship = {}
      , salt = 'UL0jz'

    user.path = '/api/user'

    user.login = function (options, callback) {
      var endpoint = '/login'
        , url = host + this.path + endpoint

      $.post(url, options, function (data) {
        console.log(data)
        if (typeof callback == 'function') callback(data)
      })
    }

    user.checkExpire = function (code) {
      var endpoint = '/chkcode'
        , url = host + this.path + endpoint

      $.post(url, {code: code}, function (res) {
        console.log('check', res)
      })
    }

    user.checkName = function (username, callback) {
      var endpoint = '/checkname'
        , url = host + this.path + endpoint

      $.get(url, {user: username}, function (data) {
        if (typeof callback == 'function') callback(data)
      })
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

    user.anonymousLogin = function (options, callback) {
      var osInfoReg = /\((\S+)\)\((\S+)\)\((\S+)\)\((\S+)\)/
        , osInfo = _.rest(options.guestinfo.match(osInfoReg))
        , secret = SHA1.hex(osInfo.join(salt))
        , send = {}
        , endpoint = '/anonymous'
        , url = host + this.path + endpoint

      send.guestinfo = options.guestinfo
      send.secret = secret
      send.check = options.check

      $.post(url, send, function (data) {
        console.log(data)
        if (typeof callback == 'function')
          callback(data)
      })
    }

    user.getVerifyCode = function (imgSelector) {
      var endpoint = '/verifycode'
        , url = host + this.path + endpoint
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
