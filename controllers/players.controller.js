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
        return res.status(200).json({status: 200, data: players, message: "Succesfully Players Recieved"});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getPlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    var id = req.params.id;

    try{
        var player = await PlayerService.getPlayer(gameId, id)
        return res.status(200).json({status: 200, data: player, message: "Succesfully Player Recieved"});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createPlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    var player = {
        name: req.body.name
    }

    try{
        var createdPlayer = await PlayerService.createPlayer(gameId, player)
        return res.status(201).json({status: 201, data: createdPlayer, message: "Succesfully Created Player"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.updatePlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    
    var id = req.params.id;

    console.log(req.body)

    var player = {
        id,
        name: req.body.name,
        loyalty: req.body.loyalty,
        character: req.body.character,
        isLeader: req.body.isLeader
    }

    try{
        var updatedPlayer = await PlayerService.updatePlayer(gameId, player)
        return res.status(200).json({status: 200, data: updatedPlayer, message: "Succesfully Updated Player"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removePlayer = async function(req, res, next){
    var gameId = req.params.gameId;

    var id = req.params.id;

    try{
        var deleted = await PlayerService.deletePlayer(gameId, id)
        return res.status(204).json({status:204, message: "Succesfully Player Deleted"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}