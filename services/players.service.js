var Game = require('../models/game.model');

_this = this;


exports.getPlayers = async function(gameId){
    const game = await Game.findById(gameId)
    if( !game ){
        return [404, 'Game not found'];
    }
    var players = game.players;
    return [200, players];
}

exports.getPlayer = async function(gameId, playerId){
    const game = await Game.findById(gameId)
    if( !game ){
        return [404, 'Game not found'];
    }

    const player = game.players.find(player => player.id === playerId);
    if (!player) {
        return [404, 'Player not founc'];
    }
    return [200, player];
}

exports.createPlayer = async function(gameId, player){
    const game = await Game.findById(gameId)
    if( !game ){
        return [404, 'Game not found'];
    }

    const newPlayer = {
        name: player.name,
        loyalty: false,
        character: 0,
        currentVote: false,
        hasVoted: false,
        currentQuest: false,
        hasQuested: false
    }

    game.players = game.players.concat([newPlayer]);

    const playerId = game.players[game.players.length-1];

    await game.save();
    return [201, playerId];
}

exports.updatePlayer = async function(gameId, newPlayer){
    let game = await Game.findById(gameId);
    if( !game ){
        return [404, 'Game not found'];
    }

    const playerIndex = game.players.findIndex(player => player.id === newPlayer.id);
    const player = game.players[playerIndex];

    for (var [key, value] of Object.entries(newPlayer)) {
        player[key] = value;
    }

    await game.save();
    return [201, player];
}

exports.deletePlayer = async function(gameId, playerId){
    let game = await Game.findById(gameId);
    if( !game ){
        return [404, 'Game not found'];
    }

    game.players = game.players.filter(player => player.id !== playerId);

    await game.save();
    return [204, null];
}