
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

module.exports = admiral;