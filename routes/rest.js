/*
 * Module exports a router instance to handle REST request from the
 * client.
*/

var express = require('express')
  , router = express.Router()
  , gameData = require('../lib/game-data')
  , Admiral = require('../lib/admiral')
  , adFinder = new Admiral('finder')

router.get('/ships/:mixId', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else {
    // console.log('ships required')
    // console.log('id', req.params.mixId)
    // console.log(adFinder.findByMixId(req.params.mixId))
    res.json(adFinder.findByMixId(req.params.mixId).ships)
  }
})

module.exports = router