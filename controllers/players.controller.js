var PlayerService = require('../services/players.service');

_this = this;


exports.getPlayers = async function(req, res, next){
    var gameId = req.params.gameId;

    try{
        const [statusCode, response] = await PlayerService.getPlayers(gameId);
        return res.status(statusCode).json(response);
    }catch(e){
        return res.status(500).json(e.message);
    }
};

exports.getPlayer = async function(req, res, next){
    var gameId = req.params.gameId;
    var playerId = req.params.id;

    try{
        const [statusCode, response] = await PlayerService.getPlayer(gameId, playerId)
        return res.status(statusCode).json(response);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.createPlayer = async function(req, res, next){
    var gameId = req.params.gameId;
    var player = req.body;

    try{
        const [statusCode, response] = await PlayerService.createPlayer(gameId, player)
        return res.status(statusCode).json(response)
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.updatePlayer = async function(req, res, next){
    const gameId = req.params.gameId;
    let player = req.body;
    player.id = req.params.id;
    
    try{
        const [statusCode, response] = await PlayerService.updatePlayer(gameId, player)
        return res.status(statusCode).json(response)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.removePlayer = async function(req, res, next){
    var gameId = req.params.gameId;
    var id = req.params.id;

    try{
        const [statusCode, response] = await PlayerService.deletePlayer(gameId, id)
        if (response) {
            return res.status(statusCode).json(response);
        } else {
            return res.status(statusCode).json();
        }
    }catch(e){
        return res.status(500).json(e.message)
    }

}