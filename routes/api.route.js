var express = require('express')

var router = express.Router()
var games = require('./api/games.route')


router.use('/games', games);


module.exports = router;