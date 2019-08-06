var GameService = require('../services/games.service');
var PlayerService = require('../services/players.service');

var CharacterEnum = require('../enums/character.enum');
var LoyaltyEnum = require('../enums/loyalty.enum');
var GamePhaseEnum = require('../enums/gamePhase.enum');

_this = this;


exports.startGame = async function(req, res, next) {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    
    try {
        const game = await GameService.getGame(gameId);

        // check in lobby phase
        if (game.phase != GamePhaseEnum.lobby) {
            return res.status(400).json({status: 400, message: "Only allowed to start game from lobby!"});
        }

        // check 5-10 players
        let numPlayers = game.players.length;

        if (numPlayers < 5 || numPlayers > 10) {
            return res.status(400).json({status: 400, message: "Need between 5 to 10 players to start game!"});
        }

        // assign players' loyalties
        let numGood = Math.ceil(numPlayers / 3)
        for (var i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            const rand = Math.floor(Math.random() * numPlayers);

            if( rand < numGood ) {
                player.loyalty = LoyaltyEnum.good;
                numGood--;
            } else {
                player.loyalty = LoyaltyEnum.evil;
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

        return res.status(200).json({status: 200, data: updatedGame, message: "Game has started"});

    } catch(e) {
        return res.status(500).json({status: 500, message: e.message});
    }

    
}
