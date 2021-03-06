var express = require('express')

var router = express.Router({ mergeParams: true })
var gameActions = require('./gameActions.route')

router.use('/:playerId/gameActions', gameActions);

var PlayerController = require('../../controllers/players.controller');

router.get('/', PlayerController.getPlayers)
router.get('/:id', PlayerController.getPlayer)
router.post('/', PlayerController.createPlayer)
router.put('/:id', PlayerController.updatePlayer)
router.delete('/:id', PlayerController.removePlayer)

module.exports = router;