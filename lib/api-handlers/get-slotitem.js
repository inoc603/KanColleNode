var io = null
  , gameData = require('../game-data')
  , _ = require('underscore')
  , newKey = { 'api_id': 'id'
             , 'api_slotitem_id': 'item_id'
             , 'api_locked': 'locked'
             , 'api_level': 'level'
             }
  , fs = require('fs')

function getSlotItem (req, data, admiral) {
  // console.log(data)
  var temp = {}
  var tempList = {}
  for (var i in data) {
    temp = {}
    for (var key in newKey)
      temp[newKey[key]] = data[i][key]
    tempList[temp.id] = temp
  }
    
  admiral.equipment = tempList
  // console.log('[equipment]', admiral.equipment)
  try {
    fs.writeFileSync( 'admiral/'+admiral.memberId+'/equipment.json'
                  , JSON.stringify(admiral.equipment))
  } catch (e) {
    console.log(e)
  }
  
}

module.exports = function (socket) {
  io = socket
  return getSlotItem
}
