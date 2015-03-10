var gameData = {}
  , fs = require('fs')

gameData.shipName = {}
var SHIP_NAME_FILE = 'e:/Projects/KanColleNode/data/ship_name.json'
fs.exists(SHIP_NAME_FILE, function getJsonFile (exist) {
  if (exist)
    gameData.shipName = JSON.parse(fs.readFileSync(SHIP_NAME_FILE, 'utf8'))
})

gameData.storeShipNames = function storeShipNames () {
  fs.writeFile( SHIP_NAME_FILE
              , JSON.stringify(gameData.shipName)
              , function (err) {
                  if (err) console.log(err.stack)
                })
}


module.exports = gameData