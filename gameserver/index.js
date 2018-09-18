
const io = require('socket.io')();
const port = process.env.PORT || 3000;

function onConnection(socket) {
	//console.log('Connection received: ' + socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort);
	socket.broadcast.emit('announce', {} )

    socket.on('move', (data) => {
		socket.broadcast.emit('moved', data)
		socket.userid = data.uuid;
	    //console.log('move received: ');
	    //console.log(data);
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('remove', { "uuid" : socket.userid })
	})
}

io.on('connection', onConnection);

io.listen(port);
console.log('listening on port ',port);