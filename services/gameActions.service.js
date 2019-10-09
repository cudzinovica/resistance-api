var GameService = require('../services/games.service');
var PlayerService = require('../services/players.service');

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

exports.startGame = async function(gameId) {
    
    let game = (await GameService.getGame(gameId))[1];

    // check in lobby phase
    if (game.phase != GamePhaseEnum.lobby) {
        return [400, "Only allowed to start game from lobby!"];
    }

    // check 5-10 players
    let numPlayers = game.players.length;

    if (numPlayers < 5 || numPlayers > 10) {
        return [400, "Need between 5 to 10 players to start game!"];
    }

    // reset game properties
    game.missionResults = [];
    game.failedVotes = 0;
    game.currentRound = 0;
    game.currentTeam = [];
    game.winningTeam = null;

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
    let updatedGame = (await GameService.updateGame(game.id, game.toObject()))[1];

    return [200, updatedGame];
}


exports.endGame = async function(gameId, playerId) {
    let game = (await GameService.getGame(gameId))[1];

    if (!game) {
        return [400, "Game does not exist"];
    }

    // set game phase to lobby
    game.phase = GamePhaseEnum.lobby;

    // update game
    game = (await GameService.updateGame(game.id, game.toObject()))[1];

    return [200, game];
}

exports.submitSelection = async function(gameId, playerId, selection) {
    let game = (await GameService.getGame(gameId))[1];

    // confirm in selection phase
    if (game.phase != GamePhaseEnum.selection) {
        return [400, "Must be in selection phase"];
    }

    // confirm player is leader
    if (game.players[game.currentLeaderIdx].id != playerId ) {
        return [400, "Must be leader to submit selection"];
    }

    // confirm num submitted players is correct
    const requiredTeamSize = teamSizeMap[game.players.length][game.currentRound];
    if (selection.length != requiredTeamSize) {
        return [400, `Team selection must be ${requiredTeamSize} players large`];
    }

    // confirm submitted players exist in this game
    if (!selection.every(playerId => game.players.find(player => player.id === playerId) !== undefined)) {
        return [400, `Not all submitted players are in this game`];
    }

    // set submitted players ids as current team
    game.currentTeam = selection;

    // update phase to vote phase
    game.phase = GamePhaseEnum.vote;

    // update game
    game = (await GameService.updateGame(game.id, game.toObject()))[1];
    
    return [200, game];
}

exports.submitVote = async function(gameId, playerId, playerVote) {
    let game = (await GameService.getGame(gameId))[1];

    // confirm in vote phase
    if (game.phase != GamePhaseEnum.vote) {
        return [400, "Must be in vote phase"];
    }

    // update player's vote and set hasVoted to true
    const playerIndex = game.players.findIndex(player => player.id === playerId);
    const player = game.players[playerIndex];

    player.currentVote = playerVote;
    player.hasVoted = true;

    // update and retrieve game to minimize chance for missing other players' updates
    await GameService.updateGame(game.id, game.toObject());
    game = (await GameService.getGame(gameId))[1];

    // if all players have voted:
    let allVoted = game.players.every(player => player.hasVoted);
    
    if (allVoted) {
        // set everyone's hasVoted to false and count number of yes votes
        let numVotedYes = 0;
        game.players.forEach(player => {
            if (player.currentVote) numVotedYes++;
            player.hasVoted = false;
        })

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
    
    game = (await GameService.updateGame(game.id, game.toObject()))[1];
    
    return [200, game];
}

exports.submitQuest = async function(gameId, playerId, playerQuest) {
    let game = (await GameService.getGame(gameId))[1];

    // check in quest phase
    if (game.phase != GamePhaseEnum.quest){
        return [400, 'Must be in quest phase'];
    }

    // check curr player is in current team
    if (!game.currentTeam.includes(playerId)){
        return [400, 'Must be part of the quest team'];
    }

    // update current quest and set has quested to true
    const playerIndex = game.players.findIndex(player => player.id === playerId);
    const player = game.players[playerIndex];

    player.currentQuest = playerQuest;
    player.hasQuested = true;

    // update and retrieve game to minimize chance for missing other players' updates
    await GameService.updateGame(game.id, game.toObject());
    game = (await GameService.getGame(gameId))[1];

    // if all players have quested:
    let allQuested = game.currentTeam.every(playerId => game.players.find(player => player.id === playerId).hasQuested);

    if( allQuested ) {
        // set everyone's has quested to false and count num fails
        let numFails = 0;
        game.currentTeam.forEach(playerId => {
            const playerIndex = game.players.findIndex(player => player.id === playerId);
            const player = game.players[playerIndex];
            if (!player.currentQuest) numFails++;
            player.hasQuested = false;
        })

        // calculate mission result
        // (one fail to fail mission, if 4th quest and 7 or more players, two fails required to fail quest
        let missionSuccess;
        if ( game.currentRound == 3 && game.players.length >= 7 ) {
            missionSuccess = numFails < 2;
        } else {
            missionSuccess = numFails == 0;
        }
        
        // set current round's mission result to mission result
        game.missionResults.push(missionSuccess);

        // if 3 wins for good or evil
            // set winning team
            // set game phase to lobby
        let goodSuccesses = 0;
        let evilSuccesses = 0;
        game.missionResults.forEach(missionResult => { if( missionResult ) goodSuccesses++; else evilSuccesses++; })
        if( goodSuccesses >= 3 ) {
            game.winningTeam = LoyaltyEnum.good;
            game.phase = GamePhaseEnum.lobby;
        } else if( evilSuccesses >= 3) {
            game.winningTeam = LoyaltyEnum.evil;
            game.phase = GamePhaseEnum.lobby;
        }
        // else
        else {
            // increment current round
            game.currentRound++;

            // increment current leader
            game.currentLeaderIdx = (game.currentLeaderIdx + 1) % game.players.length;

            // set game phase to selection
            game.phase = GamePhaseEnum.selection;
        }
    }
    
    game = (await GameService.updateGame(game.id, game.toObject()))[1];
    
    return [200, game];
}