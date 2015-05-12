var sqlite3 = require('sqlite3').verbose()
  , fs = require('fs')
  , admirals = []
  , Datastore = require('nedb')

function admiral(token) {
  this.client = null
  this.token = token
  this.nickname = null
  this.memberId = null
  this.nicknameId = null
  this.fleets = []
  admirals.push(this)
}

admiral.prototype.findByToken = function (token) {
  for (var i = 0; i < admirals.length; i++)
    if (admirals[i].token == token)
      return admirals[i]
  return null
}

admiral.prototype.findByMixId = function (mix_id) {
  for (var i = 0; i < admirals.length; i++)
    if (admirals[i].memberId+admirals[i].nicknameId == mix_id)
      return admirals[i]
  return null
}

admiral.prototype._dbOpt = function (name) {
  var opt = {}
  opt.filename = 'admiral/' + this.memberId + '/' + name + '.db'
  opt.autoload = true
  return opt
}

admiral.prototype.initDatabase = function () {
  // this.db = new sqlite3.Database(this.getDataDir() + '/records')
  // var script = fs.readFileSync('scripts/init-admiral.sql').toString()
  // this.db.exec(script)
  this.db = {}
  this.db.battleLog = new Datastore(this._dbOpt('battle-log'))
  this.db.buildLog = new Datastore(this._dbOpt('build-log'))
}

admiral.prototype.getDataDir = function () {
  if (this.memberId)
    return 'admiral/' + this.memberId
  else
    return null
}

admiral.prototype.insertBuildShip = function (doc) {
  // doc.$is_complete = false
  // this.db.run(scripts.insert_build_ship, doc)
  //        .all('SELECT * FROM build_log', function (err, rows) {
  //          console.log(rows)
  //        })
}

admiral.prototype.updateBuildShip = function (doc) {
  // this.db.run(scripts.update_build_ship, doc)
  //   .all('SELECT * FROM build_log', function (err, rows) {
  //     console.log(rows)
  //   })
}

admiral.prototype.insertBattleResult = function (doc) {
  // this.db.run(scripts.insert_battle_result, doc, function (err) {
  //   if (err)
  //     console.log('[ERR]', err)
  // })
  this.db.battleLog.insert(doc, function (err, doc) {
    if (err) console.log('[INSERT ERRO]', err)
  })

}

admiral.prototype.finishBuildShip = function (dock) {
  // this.db.run(scripts.finish_build_ship, dock)
}

module.exports = admiral
