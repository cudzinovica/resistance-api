var GameActionsService = require('../services/gameActions.service');
var GamesService = require('../services/games.service');

module.exports = function(io) {
    io.on('connection', socket => {
        let gameId;
        socket.on('join-game', data => {
            gameId = data.gameId;
            socket.join(gameId);

            GamesService.getGame(gameId).then(game => {
                io.to(gameId).emit('game', game);
            });
        });
        socket.on('start-game', data => {
            const gameId = data.gameId;

            const [statusCode, resp] = GameActionsService.startGame(gameId);

            if (statusCode == 200) {
                //broadcst game to room
                io.to(gameId).emit('game', resp);
            } else {
                //emit error to socket
                socket.emit('error', resp);
            }
        })
    });
}
