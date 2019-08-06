var GameService = require('../services/games.service')
var PlayerService = require('../services/players.service')

var CharacterEnum = require('../enums/character.enum')
var LoyaltyEnum = require('../enums/loyalty.enum')
var GamePhaseEnum = require('../enums/gamePhase.enum')

_this = this


exports.startGame = async function(req, res, next){
    var gameId = req.params.gameId;
    var playerId = req.params.playerId;
    
    try{
        //check 5-10 players
        var game = await GameService.getGame(gameId)

        var numPlayers = game.players.length;

        if( numPlayers < 5 || numPlayers > 10) {
            return res.status(400).json({status: 400, message: "Need between 5 to 10 players to start game!"});
        }

        //assign players' loyalties
        var numGood = Math.ceil(numPlayers / 3)

        for( var i = 0; i < game.players.length; i++ ) {
            var player = game.players[i];
            var rand = Math.floor(Math.random() * numPlayers);
            if( rand < numGood){
                player.loyalty = LoyaltyEnum.good;
                numGood--;
            } else {
                player.loyalty = LoyaltyEnum.evil;
            }
            numPlayers--

            var savedPlayer = await PlayerService.updatePlayer(gameId, player);
        }

        
        //update one random player to leader

        //update game phase to selection



        var updatedGame = await GameService.updateGame(game)

        return res.status(200).json({status: 200, data: game, message: "Game has started"});

    }catch(e){
        return res.status(500).json({status: 500, message: e.message});
    }

    
}
