define(
  [ 'jquery'
  , 'underscore'
  , 'backbone'
  , 'apps/common/service'
  ]
, function($, _, Backbone, service){
    var User = function () {
      var store = localStorage.getItem('kcnuser')
      if (store)
        try {
          store = JSON.parse(store)
          this.username = store.username
          this.password = store.password
          this.expire = store.expire
          this.code = store.code
        }
        catch (e) {
          console.log(e)
        }
      this.online = false
    }

    User.prototype.login = function (options, callback) {
      var user = this
      user.username = options.user
      if (options.remember) {
        user.password = options.passwd
        delete options.remember
      }
      service.user.login(options, function (res) {
        console.log(res, res.errcode)
        if (res.errcode == 0) {
          console.log('login succeed')
          user.code = res.content.code
          user.expire = new Date().getTime() + 2*24*60*60*1000
          user.online = true
          user._save()
        }
        if (typeof callback == 'function') callback(res)
      })
    }

    User.prototype.anonymousLogin = function (options, callback) {
      var user = this
      service.user.anonymousLogin(options, function (res) {
        if (res.errcode == 0) {
          if (user.username) delete user.username
          if (user.password) delete user.password
          user.code = res.content.code
          user.expire = new Date().getTime() + 2*24*60*60*1000
          user._save()
        }
        if (typeof callback == 'function') callback(res)
      })
    }

    User.prototype._save = function () {
      console.log(this)
      var store = _.pick(this, 'username', 'password', 'code', 'expire')
      localStorage.setItem('kcnuser', JSON.stringify(store))
    }

    return User
  }
)
