var gameData = require('../game-data')

var Item = function (itemData, admiral) {
  if (itemData.id) {
    var itemId = admiral.equipment[itemData.id].item_id
    var template = gameData.equipment[itemId]
    for (var i in template)
      this[i] = template[i]
    this.item_id = this.id
    for (var i in itemData)
      this[i] = itemData[i]
    this.type_name = gameData.equipmentType[this.type[2]].name
  }
}

Item.prototype.isBattleAircraft = function () {
  return (gameData.equipmentType.battle_plane.indexOf(this.type[2])!=-1)
}

Item.prototype.isAircraft = function () {
  return (gameData.equipmentType.plane.indexOf(this.type[2])!=-1)
}

Item.prototype.isRadar = function () {
  return (gameData.equipmentType.radar.indexOf(this.type[2])!=-1)
}

Item.prototype.isReconAircraft = function () {
  return ([9, 10, 11].indexOf(this.type[2])!=-1)
}


module.exports = Item
