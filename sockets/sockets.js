module.exports = function(io) {
    io.on('connection', socket => {
        let room;
        socket.on('join-game', data => {
            room = data.room;
            socket.join(room);
        });
        socket.on('start-game', data => {
            
        })
    });
}
