var gameData = {}
  , fs = require('fs')
  , storage = { 'ships' : './data/ships.json'
              , 'shipTypes' : './data/ship-types.json'
              , 'expeditions' : './data/expeditions.json'
              , 'enemy' : './data/enemy.json'
              , 'equipment' : './data/equipment.json'
              , 'quests': './data/quests.json'
              , 'combinedMap': './data/combined-map.json'
              , 'equipmentType': './data/equip-type.json'
              }
  , tableName = { 'ships' : 'ships'
                , 'shipTypes' : 'ship_types'
                , 'expeditions' : 'expeditions'
                , 'enemy' : 'enemies'
                , 'equipment' : 'equipment'
                , 'quests': 'quests'
                , 'combinedMap': './data/combined-map.json'
                , 'equipmentType': './data/equip-type.json'
                }
  , sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.Database('./data/game-data')

for (var i in storage) {
  try {
    gameData[i] = JSON.parse(fs.readFileSync(storage[i]))
  } 
  catch (e) {
    if (e.code == 'ENOENT') {
      console.log('failed to load ' + i + ', init later')
      gameData[i] = {}
    }
    else
      throw e
  }
}

gameData.store = function store (option) {
  fs.writeFile( storage[option]
              , JSON.stringify(gameData[option])
              , function (err) {
                  if (err) console.log(err.stack)
                })

}

module.exports = gameData