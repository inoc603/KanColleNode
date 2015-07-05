var _ = require('underscore')
  , config = require('./config')

var locals = [ '127.0.0.1', 'localhost', 'localhost.']

var util = {}

util.isLocal = function (host) {
  return locals.indexOf(host) !== -1
}

util.toThisServer = function (host, port) {
  return this.isLocal(host) && port === config.get('port')
}

util.getPlugins = function () {
  var plugins
  try {
    var regJs = /(.*)\.js$/
    plugins = fs.readdirSync('plugins')
    plugins = plugins.reduce(function (pv, cv) {
      if (regJs.test(cv)) pv.push(cv.match(regJs)[1])
      return pv
    }, [])

    console.log(JSON.stringify(plugins))
  }
  catch(e) {
    if (e.code == 'ENOENT') {
      plugins = ''
    }
  }
  return plugins
}

util.isGameApi = function (path) {
  return path.match(/^\/kcsapi\//) !== null
}

util.isGameContent = function (path) {
  return path.match(/^\/kcs\/\S*/) !== null
}

module.exports = util
