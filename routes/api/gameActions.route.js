var express = require('express')

var router = express.Router({ mergeParams: true })

var GameActionsController = require('../../controllers/gameActions.controller');

router.post('/startGame', GameActionsController.startGame)
router.post('/endGame', GameActionsController.endGame)
// router.post('/submitSelection', GameActionsController.submitSelection)
// router.post('/submitVote', GameActionsController.submitVote)
// router.post('/submitQuest', GameActionsController.submitQuest)

module.exports = router;