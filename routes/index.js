var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'KanColleNode' });
});

/* GET game page */
router.get('/game', function (req, res) {
	res.render('game', { title: 'KanColleNode'});
});

/* GET dubug page */
router.get('/debug', function (req, res) {
	res.render('debug', { title: 'KanColleNode'});
});

module.exports = router;
