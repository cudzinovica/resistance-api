var express = require('express')

var router = express.Router()
var players = require('./players.route')

router.use('/:gameId/players', players);

var GameController = require('../../controllers/games.controller');

// router.get('/', GameController.getGames)
router.get('/:id', GameController.getGame)
router.post('/', GameController.createGame)
router.put('/:id', GameController.updateGame)
router.delete('/:id', GameController.removeGame)

module.exports = router;