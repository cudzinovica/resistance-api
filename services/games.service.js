var Game = require('../models/game.model');
var GamePhaseEnum = require('../enums/gamePhase.enum');

_this = this


exports.getGames = async function(query, page, limit) {
    var options = {
        page: page,
        limit: limit
    }

    var games = await Game.paginate(query, options);
    return [200, games];
}

exports.getGame = async function(id) {
    return [200, await Game.findById(id)];
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

    return [201, await newGame.save()];
}

exports.updateGame = async function(game) {
    const id = game.id;

    var oldGame = await Game.findById(id);

    for (var [key, value] of Object.entries(game)) {
        oldGame[key] = value;
    }

    return [201, await oldGame.save()];
}

exports.deleteGame = async function(id){
    var deleted = await Game.deleteOne({_id: id})
    
    return [204, null];
}