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
      // console.log(options)
      var endpoint = '/login'
        , url = host + this.path + endpoint

      $.post(url, options, function (data) {
        console.log(data)
        if (typeof callback == 'function') callback(data)
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

    user.anonymousLogin = function (options) {
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
      })

      console.log(send)

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
