var express = require('express')
  , router = express.Router()
  , config = require('../lib/config')
  , async = require('async')
  , fs = require('fs')
  , util = require('../lib/util')
  , format = require('string-template')

var client_served = 0

var os = require('os')
  , osInfo = format('({hostname})({type})({arch})({release})'
                   , { hostname: os.hostname()
                     , type: os.type()
                     , arch: os.arch()
                     , release: os.release()
                     })

var plugins
try {
  var regJs = /(.*)\.js$/
  plugins = fs.readdirSync('plugins')
  plugins = plugins.reduce(function (pv, cv) {
    if (regJs.test(cv)) pv.push(cv.match(regJs)[1])
    return pv
  }, [])

  console.log(JSON.stringify(plugins))
}
catch(e) {
  if (e.code == 'ENOENT') {
    plugins = ''
  }
}


/* GET home page. */
router.get('/', function (req, res, next) {
  if (util.toThisServer(req.hostname, req.port)) {
    res.session.id = 'I LIKE ID'
    res.render('index', { title: 'KanColleNode' })
  }

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

router.get('/web', function (req, res) {
  req.session.kcnid = 'SEEME'
  res.render('web', { appMode: 'game-only'
                    , osInfo: osInfo
                    , title: 'kcn-standalone'
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
