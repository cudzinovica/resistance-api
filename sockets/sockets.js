module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.emit('news', 'world');
        socket.on('test-event', function (data) {
            console.log(data);
        })
    });
}
