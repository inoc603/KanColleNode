var express = require('express')
  , router = express.Router()
  , config = require('../lib/config')
  , async = require('async')

var client_served = 0

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'KanColleNode' })
})

/* GET game page */
router.get('/game', function (req, res) {
  res.render('game', { title: 'KanColleNode'})
})

/* GET dubug page */
router.get('/debug', function (req, res) {

  res.render('debug', { listener_num: (client_served+=1)
                      , version_css_path: 'css/browser.css'
                      , version_js_path: 'js/browser.js'})
})

router.get('/desktop', function (req, res) {

  res.render('debug', { listener_num: (client_served+=1)
                      , version_css_path: 'css/desktop.css'
                      , version_js_path: 'js/desktop.js'})
})

router.get('/desktop-no-game', function (req, res) {
  res.render('debug',{ listener_num: (client_served+=1)
                      , version_css_path: 'css/desktop-no-game.css'
                      , version_js_path: 'js/desktop-no-game.js'})
})

router.get('/backboned', function (req, res) {
  res.render('backboned', { appMode: 'desktop-no-game'})
})

router.get('/standalone', function (req, res) {
  res.render('backboned', {appMode: 'game-only'})
})

router.get('/mobile', function (req, res) {
  res.render('debug',{ listener_num: (client_served+=1)
                      , version_css_path: 'css/mobile.css'
                      , version_js_path: 'js/mobile.js'})
})

router.post('/setting', function (req, res) {

  console.log('[SETTING]', req.body)
  // async.series(
  //   [ function(){config.config = JSON.parse(req.body)}
  //   , function(){config.save()}
  //   , function(){res.json(config.config)}
  //   ]
  // )
  config.update(JSON.parse(req.body))
  res.send('success')
})

router.get('/setting', function (req, res) {

  res.json(config.config)

})

router.post('/shutdown', function (req, res) {

  console.log('[WARNNING] SHUTTING DOWN')
  process.exit(0)

})

module.exports = router
