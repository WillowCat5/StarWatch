
const io = require('socket.io')();
const port = process.env.PORT || 3000;

var whosit;
//var gamepieces = {};
var taggable = true;

function onConnection(socket) {
	//console.log('Connection received: ' + socket.request.connection.remoteAddress + ":" + socket.request.connection.remotePort);
	socket.broadcast.emit('announce', {} )

	socket.taggable = true;

	if (whosit) {
		socket.emit('it', { "uuid": whosit } )
	}

	socket.on('move', (data) => {
		socket.broadcast.emit('moved', data)
		socket.userid = data.uuid;
		// determine who's it
		if (!whosit) { 
			whosit = data.uuid; 
			io.emit('it', { "uuid": whosit } )
			//socket.broadcast.emit('it', { "uuid": whosit } )
		} 
	    //console.log('move received: ');
	    //console.log(data);
	});

	socket.on('tagged', (data) => {
		if (data.olduuid && data.newuuid && getTaggable()) {
			taggable = false;
			setInterval(function() { setTaggable(); }, 3000);
			whosit = data.newuuid; 
			io.emit('it', { "uuid" : data.newuuid })
		}
	})

	socket.on('disconnect', () => {
		if (whosit == socket.userid) { whosit = undefined }
		socket.broadcast.emit('remove', { "uuid" : socket.userid })
	})
}

function getTaggable() {
	return taggable;
}
function setTaggable() {
	taggable = true;
}

io.on('connection', onConnection);

io.listen(port);
console.log('listening on port ',port);