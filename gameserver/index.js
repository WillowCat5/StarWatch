
const io = require('socket.io')();
const port = process.env.PORT || 3000;

function onConnection(socket) {
    console.log('Connection received: ' + socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort);
    socket.on('move', (data) => {
	    socket.broadcast.emit('move', data)
	    console.log('move received: ');
	    console.log(data);
	});
}

io.on('connection', onConnection);

io.listen(port);
console.log('listening on port ',port);