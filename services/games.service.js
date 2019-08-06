var Game = require('../models/game.model')
var GamePhaseEnum = require('../enums/gamePhase.enum')

_this = this


exports.getGames = async function(query, page, limit){
    var options = {
        page: page,
        limit: limit,
        populate: 'players'
    }
    try {
        var games = await Game.paginate(query, options);
        return games;
    } catch (e) {
        throw Error('Error while Paginating Games: ' + e.message)
    }
}

exports.getGame = async function(id){

    try {
        var game = await Game.findById(id).populate('players');
        return game;
    } catch (e) {
        throw Error('Error while Finding Game: ' + e.message)
    }
}

exports.createGame = async function(){

    var newGame = new Game({
        phase: GamePhaseEnum.lobby,
        players: [],
        missionResults: [false, false, false, false, false],
        failedVotes: 0,
        currentRound: 0
    })

    try{
        var savedGame = await newGame.save()
        return savedGame;
    }catch(e){
        throw Error("Error while Creating Game: " + e.message)
    }
}

exports.updateGame = async function(game){
    var id = game.id

    try{
        var oldGame = await Game.findById(id).populate('players');
    }catch(e){
        throw Error("Error occured while Finding the Game: " + e.message)
    }

    if(!oldGame){
        return false;
    }

    console.log(oldGame)

    oldGame.phase = game.phase ? game.phase : oldGame.phase
    oldGame.players = game.players ? game.players : oldGame.players
    oldGame.missionResults = game.missionResults ? game.missionResults : oldGame.missionResults
    oldGame.failedVotes = game.failedVotes ? game.failedVotes : oldGame.failedVotes
    oldGame.currentRound = game.currentRound ? game.currentRound : oldGame.currentRound
    oldGame.currentLeader = game.currentLeader ? game.currentLeader : oldGame.currentLeader

    console.log(oldGame)

    try{
        var savedGame = await oldGame.save()
        return savedGame;
    }catch(e){
        throw Error("And Error occured while updating the Game: " + e.message);
    }
}

exports.deleteGame = async function(id){
    
    try{
        var deleted = await Game.remove({_id: id})
        if(deleted.result.n === 0){
            throw Error("Game Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Game: " + e.message)
    }
}