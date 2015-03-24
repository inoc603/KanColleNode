var express = require('express')
  , router = express.Router()

var client_served = 0

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.hostname != '127.0.0.1')
    next()
  else
    res.render('index', { title: 'KanColleNode' })
})

/* GET game page */
router.get('/game', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else
    res.render('game', { title: 'KanColleNode'})
})

/* GET dubug page */
router.get('/debug', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else
    res.render('debug', { listener_num: (client_served+=1)})
})

module.exports = router
