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
};
FAILED_VOTES_TO_LOSE = 5;


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
        game.currentLeaderIdx = Math.floor(Math.random()*game.players.length);

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
        let game = await GameService.getGame(gameId);

        if (!game) {
            return res.status(400).json("Game does not exist");
        }

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
        if (game.players[game.currentLeaderIdx].id != playerId ) {
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
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;

    try {
        let game = await GameService.getGame(gameId);

        // confirm in vote phase
        if (game.phase != GamePhaseEnum.vote) {
            return res.status(400).json("Must be in vote phase");
        }

        // update player's vote and set hasVoted to true
        let currPlayer = await PlayerService.getPlayer(gameId, playerId);

        const playerVote = req.body.vote;

        currPlayer.currentVote = playerVote;
        currPlayer.hasVoted = true;

        var updatedPlayer = await PlayerService.updatePlayer(currPlayer);

        game = await GameService.getGame(gameId);

        // if all players have voted:
        let numVotedYes = 0;
        if (game.players.every(player => { if (player.currentVote) numVotedYes++; return player.hasVoted })){
            // set everyone's hasVoted to false
            game.players.forEach(player => { player.hasVoted = false; });

            // if majority voted yes
            if (numVotedYes > game.players.length / 2){
                // set failed vote counter to 0
                game.failedVotes = 0;

                // update game phase to quest phase
                game.phase = GamePhaseEnum.quest;
            } 
            // else
            else {
                // increase failed Vote counter
                // if failed votes is 5 or greater
                if (++game.failedVotes >= FAILED_VOTES_TO_LOSE) {
                    // set evil as winner
                    game.winningTeam = LoyaltyEnum.evil;

                    // update game phase to lobby
                    game.phase = GamePhaseEnum.lobby;
                }
                // else
                else {
                    // set current leader to next player
                    game.currentLeaderIdx = (game.currentLeaderIdx + 1) % game.players.length;

                    // set phase to selection phase
                    game.phase = GamePhaseEnum.selection;
                }
            }
        }
        
        const savedGame = await GameService.updateGame(game);

        return res.status(200).json(savedGame);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

exports.submitQuest = async function(req, res, next) {
    // if 4th quest and 7 or more players, two fails required to fail quest
    return res.status(405).json();

    // const gameId = req.params.gameId;
    // const playerId = req.params.playerId;

    // try {
        // return res.status(200).json(updatedGame);
    // } catch(e) {
    //     return res.status(500).json(e.message);
    // }
}