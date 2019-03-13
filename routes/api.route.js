var express = require('express')

var router = express.Router()
var todos = require('./api/todos.route')
var games = require('./api/games.route')


router.use('/todos', todos);
router.use('/games', games);


module.exports = router;