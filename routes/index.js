var express = require('express')
  , router = express.Router()
  , config = require('../lib/config')
  , async = require('async')
  , fs = require('fs')

var client_served = 0

var os = require('os')
    , osInfo = '(' + os.hostname() + ')'
             + '(' + os.type() + ')'
             + '(' + os.arch() + ')'
             + '(' + os.release() + ')'

var plugins = fs.readdirSync('plugins')
  , regJs = /(.*)\.js$/

plugins = plugins.reduce(function (pv, cv) {
  if (regJs.test(cv)) pv.push(cv.match(regJs)[1])
  return pv
}, [])

console.log(JSON.stringify(plugins))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'KanColleNode' })
})

router.get('/backboned', function (req, res) {
  res.render('backboned', { appMode: 'desktop-no-game'
                          , osInfo: osInfo
                          , title: 'kcn'
                          , plugins: plugins
                          })
})

router.get('/standalone', function (req, res) {
  res.render('backboned', { appMode: 'game-only'
                          , osInfo: osInfo
                          , title: 'kcn-standalone'
                          , plugins: plugins
                          })
})

router.get('/react', function (req, res) {
  res.render('react', { appMode: 'desktop-no-game'
                      , osInfo: osInfo
                      , plugins: plugins
                      })
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
