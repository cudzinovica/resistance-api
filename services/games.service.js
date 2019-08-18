var Game = require('../models/game.model')
var GamePhaseEnum = require('../enums/gamePhase.enum')

_this = this


exports.getGames = async function(query, page, limit, populatePlayers) {
    var options = {
        page: page,
        limit: limit
    }
    if (populatePlayers) {
        options.populate = 'players'
    }
    try {
        var games = await Game.paginate(query, options);
        return games;
    } catch (e) {
        throw Error('Error while Paginating Games: ' + e.message)
    }
}

exports.getGame = async function(id, populatePlayers) {
    try {
        if (populatePlayers) {
            var game = await Game.findById(id).populate('players');
        } else {
            var game = await Game.findById(id);
        }

        console.log(game);
        return game;
    } catch (e) {
        throw Error('Error while Finding Game: ' + e.message)
    }
}

exports.createGame = async function(){
    var newGame = new Game({
        phase: GamePhaseEnum.lobby,
        players: [],
        missionResults: [],
        failedVotes: 0,
        currentRound: 0,
        currentLeaderIdx: null,
        currentTeam: [],
        winningTeam: null
    })

    try{
        var savedGame = await newGame.save()
        return savedGame;
    }catch(e){
        throw Error("Error while Creating Game: " + e.message)
    }
}

exports.updateGame = async function(game){
    try{
        const id = game.id;

        try {
            var oldGame = await Game.findById(id).populate('players');
        } catch(e) {
            throw Error('Error occured while finding Game: ' + e.message);
        }

        for (var [key, value] of Object.entries(game)) {
            oldGame[key] = value;
        }

        var updatedGame = await oldGame.save();
        return updatedGame;
    }catch(e){
        throw Error("An Error occured while updating the Game: " + e.message);
    }
}

exports.deleteGame = async function(id){
    try{
        var deleted = await Game.deleteOne({_id: id})
        console.log(deleted)
        if(deleted.deletedCount === 0){
            throw Error("Game Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Game: " + e.message)
    }
}