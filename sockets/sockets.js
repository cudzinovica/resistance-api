var GameActionsService = require('../services/gameActions.service');
var GamesService = require('../services/games.service');

function getAndBroadcastGame(io, gameId) {
    GamesService.getGame(gameId, true).then(game => {
        io.to(gameId).emit('game', game);
    });
}

module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('join-game', data => {
            const gameId = data.gameId;
            socket.join(gameId);

            getAndBroadcastGame(io, gameId);
        });
        socket.on('leave-game', data => {
            const gameId = data.gameId;
            socket.leave(gameId);

            getAndBroadcastGame(io, gameId);
        })
        socket.on('start-game', data => {
            const gameId = data.gameId;

            GameActionsService.startGame(gameId).then(rsp => {
                const [statusCode, resp] = rsp;

                if (statusCode == 200) {
                    //broadcst game to room
                    io.to(gameId).emit('game', resp);
                } else {
                    //emit error to socket
                    socket.emit('error_msg', resp);
                    GamesService.getGame(gameId, true).then(game => {
                        socket.emit('game', game);
                    });
                }
            }).catch(error => {
                socket.emit('error_msg', error);
            });
        });

    });
}
