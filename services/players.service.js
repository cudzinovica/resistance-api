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

    console.log(oldGame)

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

    oldGame = await getGame(gameId)

    if( !oldGame ){
        return false
    }

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
        isLeader: false
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

exports.updatePlayer = async function(gameId, player){

    oldGame = await getGame(gameId)

    if( !oldGame ){
        return false
    }
    
    var id = player.id

    try{
        var oldPlayer = await Player.findById(id);
    }catch(e){
        throw Error("Error occured while Finding the Player: " + e.message)
    }

    if(!oldPlayer){
        return false;
    }

    if (player.name != null) { oldPlayer.name = player.name; }
    if (player.loyalty != null) { oldPlayer.loyalty = player.loyalty; }
    if (player.character != null) { oldPlayer.character = player.character; }

    try{
        var savedPlayer = await oldPlayer.save()
        return savedPlayer;
    }catch(e){
        throw Error("And Error occured while updating the Player: " + e.message);
    }
}

exports.deletePlayer = async function(gameId, id){

    oldGame = await getGame(gameId)

    if( !oldGame ){
        return false
    }
    
    try{
        var deleted = await Player.remove({_id: id})
        if(deleted.result.n === 0){
            throw Error("Player Could not be deleted")
        }
        
        var savedGame = await Game.findOneAndUpdate(gameId, {$pull: {players: id}});

        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Player: " + e.message)
    }
}