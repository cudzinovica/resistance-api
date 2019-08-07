var GameService = require('../services/games.service')
var GamePhase = require('../enums/gamePhase.enum')

_this = this


exports.getGames = async function(req, res, next){

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10; 

    console.log(page, limit)

    try{
        var games = await GameService.getGames({}, page, limit)
        return res.status(200).json(games);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.getGame = async function(req, res, next){

    var id = req.params.id;

    try{
        var game = await GameService.getGame(id)
        return res.status(200).json(game);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.createGame = async function(req, res, next){

    try{
        var createdGame = await GameService.createGame()
        return res.status(201).json(createdGame)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.updateGame = async function(req, res, next){

    var id = req.params.id;

    console.log(req.body)

    var game = {
        id,
        phase: req.body.phase,
        players: req.body.players,
        missionResults: req.body.missionResults,
        failedVotes: req.body.failedVotes,
        currentRound: req.body.currentRound
    }

    try{
        var updatedGame = await GameService.updateGame(game)
        return res.status(200).json(updatedGame)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.removeGame = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await GameService.deleteGame(id);
        return res.status(204).json();
    }catch(e){
        return res.status(500).json(e.message)
    }

}
