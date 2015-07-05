
var express = require('express')
  , router = express.Router()
  , gameData = require('../lib/game-data')
  , Admiral = require('../lib/admiral')
  , adFinder = new Admiral('finder')


router.get('/*', function (req, res, next) {
  if (util.toThisServer(req.hostname, req.port)) next()
  else {
    console.log(req.path)
    next()
  }
})

module.exports = router
