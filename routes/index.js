var express = require('express')
  , router = express.Router()
  , config = require('../lib/config')
  , async = require('async')

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

router.post('/setting', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else {
    console.log('[SETTING]', req.body)
    // async.series(
    //   [ function(){config.config = JSON.parse(req.body)}
    //   , function(){config.save()}
    //   , function(){res.json(config.config)}
    //   ]
    // )
    config.update(JSON.parse(req.body))
    res.send('success')
  }
})

router.get('/setting', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else {
    res.json(config.config)
  }
})

router.post('/shutdown', function (req, res) {
  if (req.hostname != '127.0.0.1')
    next()
  else {
    console.log('[WARNNING] SHUTTING DOWN')
    process.exit(0)
  }
})

module.exports = router
