var sqlite3 = require('sqlite3').verbose()
  , fs = require('fs')
var admirals = [];

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

admiral.prototype.initDatabase = function (memberId) {
  this.db = new sqlite3.Database(this.getDataDir() + '/records')
  console.log(this.db)
  var script = fs.readFileSync('scripts/init-admiral.sql').toString()
  console.log(script)

  this.db.serialize(function () {
    this.exec(script)
        .all('SELECT * FROM battle_log', function (err, rows) {
          if (err)
            console.log(err)
          else
            console.log(rows)
        })
  })
  
  return this.db
}

admiral.prototype.getDataDir = function () {
  if (this.memberId)
    return 'admiral/' + this.memberId
  else
    return null
}

module.exports = admiral;