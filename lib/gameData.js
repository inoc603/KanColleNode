var gameData = {}
  , fs = require('fs')
  , SHIP_FILE = './data/ships.json'
  , SHIP_TYPE_FILE = './data/ship-types.json'

fs.exists(SHIP_FILE, function getShipFile (exist) {
  if (exist)
    gameData.ships = JSON.parse(fs.readFileSync(SHIP_FILE, 'utf8'))
  else
    gameData.ships = {}
})

fs.exists(SHIP_TYPE_FILE, function getShipTypeFile (exist) {
  if (exist)
    gameData.shipTypes = JSON.parse(fs.readFileSync(SHIP_TYPE_FILE, 'utf8'))
  else
    gameData.shipTypes = {}
})

gameData.storeShips = function storeShips () {
  fs.writeFile( SHIP_FILE
              , JSON.stringify(gameData.ships)
              , function (err) {
                  if (err) console.log(err.stack)
                })
}

gameData.storeShipTypes = function storeShipTypes () {
  fs.writeFile( SHIP_TYPE_FILE
              , JSON.stringify(gameData.shipTypes)
              , function (err) {
                  if (err) console.log(err.stack)
              })
}


module.exports = gameData