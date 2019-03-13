var GameService = require('../services/games.service')
var GamePhase = require('../enums/gamePhase.enum')

_this = this


exports.getGames = async function(req, res, next){

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10; 

    console.log(page, limit)

    try{
        var games = await GameService.getGames({}, page, limit)
        return res.status(200).json({status: 200, data: games, message: "Succesfully Games Recieved"});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getGame = async function(req, res, next){

    var id = req.params.id;

    try{
        var game = await GameService.getGame(id)
        return res.status(200).json({status: 200, data: game, message: "Succesfully Game Recieved"});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createGame = async function(req, res, next){

    try{
        var createdGame = await GameService.createGame()
        return res.status(201).json({status: 201, data: createdGame, message: "Succesfully Created Game"})
    }catch(e){
        return res.status(400).json({status: 400, message: "Game Creation was Unsuccesfull"})
    }
}

exports.updateGame = async function(req, res, next){

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

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
        return res.status(200).json({status: 200, data: updatedGame, message: "Succesfully Updated Game"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeGame = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await GameService.deleteGame(id)
        return res.status(204).json({status:204, message: "Succesfully Game Deleted"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}

exports.addPlayer = async function(req, res, next){

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    

}