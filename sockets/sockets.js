var GameActionsService = require('../services/gameActions.service');
var GamesService = require('../services/games.service');
var PlayersService = require('../services/players.service');

function getAndBroadcastGame(io, roomCode) {
    GamesService.getGame(roomCode, true).then(([statusCode, resp]) => {
        io.to(roomCode).emit('game', resp);
    });
}

function deletePlayerAndBroadcastGame(io, roomCode, playerId) {
    PlayersService.deletePlayer(roomCode, playerId).then(_ => {
        getAndBroadcastGame(io, roomCode);
    });
}

module.exports = function(io) {
    io.on('connection', socket => {
        let roomCode;
        let playerId;

        socket.on('disconnect', _ => {
            console.log(`${roomCode}: ${playerId} disconnected`);
            // deletePlayerAndBroadcastGame(io, roomCode, playerId);
        });

        /** Set socket's player id. Join socket to game room. Broadcast game to room. Emit player id to socket.*/
        socket.on('join-game', data => {
            roomCode = data.roomCode.toLowerCase();
            playerId = data.playerId;

            console.log(`${roomCode}: ${playerId} joined the game`)

            socket.join(roomCode);

            getAndBroadcastGame(io, roomCode);
        });

        /** Leave socket from game room. Broadcast game to room. */
        socket.on('leave-game', _ => {
            console.log(`${roomCode}: ${playerId} left the game`);

            socket.leave();

            getAndBroadcastGame(io, roomCode);
        })

        /** Broadcast message for player with player id to leave the room. Broadcast game to room. */
        socket.on('kick-player', data => {
            console.log(`${roomCode}: ${data.playerId} has been kicked from the game`);
            
            io.to(roomCode).emit('kick-player', data.playerId);

            getAndBroadcastGame(io, roomCode);
        })

        /** Start game. Broadcast game to room. */
        socket.on('start-game', _ => {
            console.log(`${roomCode}: ${playerId} started the game`);
            GameActionsService.startGame(roomCode).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    //broadcst game to room
                    io.to(roomCode).emit('game', resp);
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
            console.log(`${roomCode}: ${playerId} ended the game`);
            GameActionsService.endGame(roomCode).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    //broadcst game to room
                    io.to(roomCode).emit('game', resp);
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
            console.log(`${roomCode}: ${playerId} submitted selection`)
            const selection = data.selection;
            GameActionsService.submitSelection(roomCode, playerId, selection).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(roomCode).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })

        /** Submit vote. Broadcast. */
        socket.on('submit-vote', data => {
            console.log(`${roomCode}: ${playerId} submitted vote`)
            const vote = data.vote;
            GameActionsService.submitVote(roomCode, playerId, vote).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(roomCode).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })

        /** Submit quest. Broadcast. */
        socket.on('submit-quest', data => {
            console.log(`${roomCode}: ${playerId} submitted quest`)
            const quest = data.quest;
            GameActionsService.submitQuest(roomCode, playerId, quest).then(([statusCode, resp]) => {
                if (statusCode == 200) {
                    io.to(roomCode).emit('game', resp);
                } else {
                    socket.emit('error_msg', resp);
                }
            })
        })
    });
}
