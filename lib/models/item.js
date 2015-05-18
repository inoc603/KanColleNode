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

module.exports = Item
