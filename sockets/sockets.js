var GameActionsService = require('../services/gameActions.service');
var GamesService = require('../services/games.service');
var PlayersService = require('../services/players.service');

function getAndBroadcastGame(io, gameId) {
    GamesService.getGame(gameId, true).then(([statusCode, resp]) => {
        io.to(gameId).emit('game', resp);
    });
}

module.exports = function(io) {
    io.on('connection', socket => {
        let gameId;
        let playerId;

        socket.on('disconnect', _ => {
            console.log(`${playerId} disconnected from ${gameId}`);
            PlayersService.deletePlayer(gameId, playerId).then(_ => {
                getAndBroadcastGame(io, gameId);
            });
        });

        /** Set socket's player id. Join socket to game room. Broadcast game to room. Emit player id to socket.*/
        socket.on('join-game', data => {
            gameId = data.gameId;
            playerId = data.playerId;

            console.log(`${playerId} joined ${gameId}`)

            socket.join(gameId);

            getAndBroadcastGame(io, gameId);
        });

        /** Delete player. Socket leaves game room. Broadcast game to room. */
        socket.on('leave-game', _ => {
            console.log(`${playerId} left ${gameId}`);
            socket.leave(gameId);

            getAndBroadcastGame(io, gameId);

            gameId = "";
        });

        /** Start game. Broadcast game to room. */
        socket.on('start-game', _ => {
            console.log(`${playerId} started ${gameId}`);
            GameActionsService.startGame(gameId).then(([statusCode, resp]) => {
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

        /** End game. Broadcast game to room. */
        socket.on('end-game', _ => {
            console.log(`${playerId} ended ${gameId}`);
            GameActionsService.endGame(gameId).then(rsp => {
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
