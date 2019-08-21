var Player = require('../models/player.model')
var Game = require('../models/game.model')

var CharacterEnum = require('../enums/character.enum')
var LoyaltyEnum = require('../enums/loyalty.enum')

_this = this


getGame = async function(gameId) {
    try{
        var oldGame = await Game.findById(gameId).populate('players')
    }catch(e){
        throw Error("Error occured while Finding the Game: " + e.message)
    }

    return oldGame
}

exports.getPlayers = async function(gameId, query, page, limit){
    oldGame = await getGame(gameId)

    if( !oldGame ){
        return false
    }

    try {
        var players = oldGame.players;
        return players;
    } catch (e) {
        throw Error('Error while Retrieving Players: ' + e.message)
    }
}

exports.getPlayer = async function(gameId, id){
    try {
        var player = await Player.findById(id)
        return player;
    } catch (e) {
        throw Error('Error while Finding Player: ' + e.message)
    }
}

exports.createPlayer = async function(gameId, player){
    oldGame = await getGame(gameId)

    if( !oldGame ){
        return false
    }

    var newPlayer = new Player({
        name: player.name,
        loyalty: false,
        character: 0,
        currentVote: false,
        hasVoted: false,
        currentQuest: false,
        hasQuested: false
    })

    try{
        var savedPlayer = await newPlayer.save();

        oldGame.players = oldGame.players.concat([newPlayer]);
        var savedGame = await oldGame.save();

        return savedPlayer;
    }catch(e){
        throw Error("Error while Creating Player: " + e.message)
    }
}

exports.updatePlayer = async function(player){
    try{
        const id = player.id;

        try {
            var oldPlayer = await Player.findById(id);
        } catch(e) {
            throw Error('Error occured while finding Player: ' + e.message);
        }

        for (var [key, value] of Object.entries(player)) {
            oldPlayer[key] = value;
        }

        var updatedPlayer = await oldPlayer.save();
        return updatedPlayer;
    }catch(e){
        throw Error("And Error occured while updating the Player: " + e.message);
    }
}

exports.deletePlayer = async function(gameId, id){
    try{
        let deleted = await Player.deleteOne({_id: id})
        if(deleted.deletedCount === 0){
            throw Error("Player Could not be deleted")
        }
        
        let savedGame = await Game.findOneAndUpdate(gameId, {$pull: {players: id}});

        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Player: " + e.message)
    }
}