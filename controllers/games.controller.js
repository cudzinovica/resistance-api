var GameService = require('../services/games.service');

_this = this


exports.getGames = async function(req, res, next){
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    var populatePlayers = req.query.populatePlayers ? req.query.populatePlayers : false;

    try{
        var games = await GameService.getGames({}, page, limit, populatePlayers)
        return res.status(200).json(games);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.getGame = async function(req, res, next){
    var id = req.params.id;
    var populatePlayers = req.query.populatePlayers ? req.query.populatePlayers : false;

    try{
        var game = await GameService.getGame(id, populatePlayers)
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
    let game = req.body;
    game.id = req.params.id;

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
        let [statusCode, response] = await GameService.deleteGame(id);
        if (response) {
            return res.status(statusCode).json(response);
        } else {
            return res.status(statusCode).json();
        }
    }catch(e){
        return res.status(500).json("Error Occured while Deleting the Game: " + e.message);
    }

}
