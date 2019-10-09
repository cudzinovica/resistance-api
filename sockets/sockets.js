var GameActionsService = require('../services/gameActions.service');
var GamesService = require('../services/games.service');
var PlayersService = require('../services/players.service');

function getAndBroadcastGame(io, gameId) {
    GamesService.getGame(gameId, true).then(([statusCode, resp]) => {
        io.to(gameId).emit('game', resp);
    });
}

function deletePlayerAndBroadcastGame(io, gameId, playerId) {
    PlayersService.deletePlayer(gameId, playerId).then(_ => {
        getAndBroadcastGame(io, gameId);
    });
}

module.exports = function(io) {
    io.on('connection', socket => {
        let gameId;
        let playerId;

        socket.on('disconnect', _ => {
            console.log(`${gameId}: ${playerId} disconnected`);
            deletePlayerAndBroadcastGame(io, gameId, playerId);
        });

        /** Set socket's player id. Join socket to game room. Broadcast game to room. Emit player id to socket.*/
        socket.on('join-game', data => {
            gameId = data.gameId;
            playerId = data.playerId;

            console.log(`${gameId}: ${playerId} joined the game`)

            socket.join(gameId);

            getAndBroadcastGame(io, gameId);
        });

        /** Start game. Broadcast game to room. */
        socket.on('start-game', _ => {
            console.log(`${gameId}: ${playerId} started the game`);
            GameActionsService.startGame(gameId).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    //broadcst game to room
                    io.to(gameId).emit('game', resp);
                } else {
                    //emit error to socket
                    socket.emit('error_msg', resp);
                }
            }).catch(error => {
                socket.emit('error_msg', error);
            });
        });

        /** End game. Broadcast game to room. */
        socket.on('end-game', _ => {
            console.log(`${gameId}: ${playerId} ended the game`);
            GameActionsService.endGame(gameId).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    //broadcst game to room
                    io.to(gameId).emit('game', resp);
                } else {
                    //emit error to socket
                    socket.emit('error_msg', resp);
                }
            }).catch(error => {
                socket.emit('error_msg', error);
            });
        });

        /** Submit vote. Broadcast. */
        socket.on('submit-selection', data => {
            console.log(`${gameId}: ${playerId} submitted selection`)
            const selection = data.selection;
            GameActionsService.submitSelection(gameId, playerId, selection).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(gameId).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })

        /** Submit vote. Broadcast. */
        socket.on('submit-vote', data => {
            console.log(`${gameId}: ${playerId} submitted vote`)
            const vote = data.vote;
            GameActionsService.submitVote(gameId, playerId, vote).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(gameId).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })

        /** Submit quest. Broadcast. */
        socket.on('submit-quest', data => {
            console.log(`${gameId}: ${playerId} submitted quest`)
            const quest = data.quest;
            GameActionsService.submitQuest(gameId, playerId, quest).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(gameId).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })
    });
}
