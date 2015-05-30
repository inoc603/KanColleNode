define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  ]
, function($, _, Backbone){
    var User = function (options) {
      options = (options?options:{})
      this.username = options.username
      this.password = options.password
    }

    User.prototype.login = function (options, callback) {
      var user = this
      user.username = options.username
      if (options.rememberPwd) options.password = options.passwd
      service.user.login(options, function (res) {
        if (res.errcode == 0) {
          user.code = res.content.code
          user.expire = new Date().getTime() + 2*24*60*60*1000
        }

        if (typeof callback == 'function') callback(res)
      })
    }

    User.prototype._save = function () {
      localStorage.setItem('username', this.username)
    }

    return User
  }
)
