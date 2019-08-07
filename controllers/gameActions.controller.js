var GameService = require('../services/games.service');
var PlayerService = require('../services/players.service');

var CharacterEnum = require('../enums/character.enum');
var LoyaltyEnum = require('../enums/loyalty.enum');
var GamePhaseEnum = require('../enums/gamePhase.enum');

_this = this;

teamSizeMap = {
    5: [2,3,2,3,3],
    6: [2,3,4,3,4],
    7: [2,3,3,4,4],
    8: [3,4,4,5,5],
    9: [3,4,4,5,5],
    10: [3,4,4,5,5]
}


exports.startGame = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    
    try {
        const game = await GameService.getGame(gameId);

        // check in lobby phase
        if (game.phase != GamePhaseEnum.lobby) {
            return res.status(400).json("Only allowed to start game from lobby!");
        }

        // check 5-10 players
        let numPlayers = game.players.length;

        if (numPlayers < 5 || numPlayers > 10) {
            return res.status(400).json("Need between 5 to 10 players to start game!");
        }

        // reset game properties
        game.missionResults = [];
        game.failedVotes = 0;
        game.currentRound = 0;

        // assign players' loyalties
        let numEvil = Math.ceil(numPlayers / 3)
        for (var i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            const rand = Math.floor(Math.random() * numPlayers);

            if( rand < numEvil ) {
                player.loyalty = LoyaltyEnum.evil;
                numEvil--;
            } else {
                player.loyalty = LoyaltyEnum.good;
            }
            numPlayers--;
        }
        
        // update one random player to leader
        let randPlayer = game.players[Math.floor(Math.random()*game.players.length)];
        game.currentLeader = randPlayer;

        // update game phase to selection
        game.phase = GamePhaseEnum.selection;

        // update game
        let updatedGame = await GameService.updateGame(game);

        return res.status(200).json(updatedGame);

    } catch(e) {
        return res.status(500).json(e.message);
    }
}


exports.endGame = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    
    try {
        const game = await GameService.getGame(gameId);

        // set game phase to lobby
        game.phase = GamePhaseEnum.lobby;

        // update game
        let updatedGame = await GameService.updateGame(game);

        return res.status(200).json(updatedGame);

    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitSelection = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;

    try {
        const game = await GameService.getGame(gameId);

        // confirm in selection phase
        if (game.phase != GamePhaseEnum.selection) {
            return res.status(400).json("Must be in selection phase");
        }

        // confirm player is leader
        if (game.currentLeader != playerId ) {
            return res.status(400).json("Must be leader to submit selection")
        }

        // confirm num submitted players is correct
        const selection = req.body.selection;
        const requiredTeamSize = teamSizeMap[game.players.length][game.currentRound];
        console.log(selection);
        console.log(requiredTeamSize);
        console.log(selection.length)
        if (selection.length != requiredTeamSize) {
            return res.status(400).json(`Team selection must be ${requiredTeamSize} players large`)
        }

        // set submitted players as current team
        game.currentTeam = selection;

        // update phase to vote phase
        game.phase = GamePhaseEnum.vote;

        // update game
        let updatedGame = await GameService.updateGame(game);

        return res.status(200).json(updatedGame);

    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitVote = async function(req, res, next) {
    return res.status(405).json();
}

exports.submitQuest = async function(req, res, next) {
    // if 4th quest and 7 or more players, two fails required to fail quest
    return res.status(405).json();
}