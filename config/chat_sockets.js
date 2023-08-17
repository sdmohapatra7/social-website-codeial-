module.exports.chatSockets = function (socketServer) {
    const io = require('socket.io')(socketServer, {
        cors: {
            origin: "*",
        }
    });

    io.sockets.on('connection', function (socket) {
        console.log('new connection received', socket.id);

        socket.on('disconnect', function () {
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data){
            console.log('Joining Request Received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        });

    });
}