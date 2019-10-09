var GameActionsService = require('../services/gameActions.service');

_this = this;

exports.startGame = async function(req, res, next) {
    const gameId = req.params.gameId;

    try {
        const [statusCode, game] = await GameActionsService.startGame(gameId);
        return res.status(statusCode).json(game);
    } catch(e) {
        return res.status(500).json(e.message);
    }

}

exports.endGame = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    
    try {
        const [statusCode, game] = await GameActionsService.endGame(gameId, playerId);
        return res.status(statusCode).json(game);

    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitSelection = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const selection = req.body.selection;

    try {
        const [statusCode, game] = await GameActionsService.submitSelection(gameId, playerId, selection);
        return res.status(statusCode).json(game);

    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitVote = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const playerVote = req.body.vote;

    try {
        const [statusCode, game] = await GameActionsService.submitVote(gameId, playerId, playerVote);

        return res.status(statusCode).json(game);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitQuest = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    const playerQuest = req.body.quest;

    try {
        const [statusCode, game] = await GameActionsService.submitQuest(gameId, playerId, playerQuest);
        
        return res.status(statusCode).json(game);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}