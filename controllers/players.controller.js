var PlayerService = require('../services/players.service')

var CharacterEnum = require('../enums/character.enum')
var LoyaltyEnum = require('../enums/loyalty.enum')

_this = this


exports.getPlayers = async function(req, res, next){
    var gameId = req.params.gameId;

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10; 

    console.log(page, limit)

    try{
        var players = await PlayerService.getPlayers(gameId, {}, page, limit)
        return res.status(200).json(players);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.getPlayer = async function(req, res, next){
    var gameId = req.params.gameId;
    var id = req.params.id;

    try{
        var player = await PlayerService.getPlayer(gameId, id)
        return res.status(200).json(player);
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.createPlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    var player = {
        name: req.body.name
    }

    try{
        var createdPlayer = await PlayerService.createPlayer(gameId, player)
        return res.status(201).json(createdPlayer)
    }catch(e){
        return res.status(500).json(e.message);
    }
}

exports.updatePlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    var player = req.body.player;
    player.id = req.params.id;

    try{
        var updatedPlayer = await PlayerService.updatePlayer(gameId, player)
        return res.status(200).json(updatedPlayer)
    }catch(e){
        return res.status(500).json(e.message)
    }
}

exports.removePlayer = async function(req, res, next){
    var gameId = req.params.gameId;
    var id = req.params.id;

    try{
        var deleted = await PlayerService.deletePlayer(gameId, id)
        return res.status(204).json()
    }catch(e){
        return res.status(500).json(e.message)
    }

}