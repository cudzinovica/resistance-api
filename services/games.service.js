var Game = require('../models/game.model');
var GamePhaseEnum = require('../enums/gamePhase.enum');

_this = this;

const ROOM_CODE_LENGTH = 6;


exports.getGames = async function(query, page, limit) {
    var options = {
        page: page,
        limit: limit
    }

    var games = await Game.paginate(query, options);
    return [200, games];
}

exports.getGame = async function(code) {
    const game = await Game.findOne({ roomCode: code })
    return [200, game];
}

generateRoomCode = () => {
    let roomCode = ""
    do {
        roomCode = Math.random().toString(36).slice(2,2+ROOM_CODE_LENGTH);
    } while ( Game.countDocuments({ roomCode: roomCode }) > 0);

    return roomCode;
}

exports.createGame = async function(){
    const roomCode = generateRoomCode();

    var newGame = new Game({
        roomCode: roomCode,
        phase: GamePhaseEnum.lobby,
        players: [],
        missionResults: [],
        failedVotes: 0,
        currentRound: 0,
        currentLeaderIdx: null,
        currentTeam: [],
        winningTeam: null,
        creationTime: Date.now(),
    })

    return [201, await newGame.save()];
}

exports.updateGame = async function(code, game) {
    var oldGame = await Game.findOne({ roomCode: code });

    for (var [key, value] of Object.entries(game)) {
        oldGame[key] = value;
    }

    return [201, await oldGame.save()];
}

exports.deleteGame = async function(code){
    var deleted = await Game.deleteOne({ roomCode: code })
    
    return [204, null];
}