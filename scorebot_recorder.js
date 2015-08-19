var fs = require('fs');
var io = require('socket.io-client');

var start = 0;

var socket = io(process.argv[2]);

socket.reconnected = false;

socket.on('connect', function(res) {
	
	if(!socket.reconnected){
		
		start = Date.now();
		
		socket.on('log', function(log) {
			
			logit('log', JSON.parse(log));
		});
	
		socket.on('score', function(score) {
		
			logit('score', score);
		});
	
		socket.on('scoreboard', function(player) {
		
			logit('scoreboard', player);
		})
	
		socket.on('reconnect', function() {
			
			socket.reconnected = true;
			socket.emit('readyForMatch', process.argv[3]);
		});
		
		socket.emit('readyForMatch', process.argv[3]);
	}
});

function logit() {
	
	var event = arguments[0];
				
	var timestamp = Date.now() - start;
	
	write({
		'timestamp': timestamp,
		'event': event,
		'args': arguments[1]
	});
} 

function write(log) {
		
	fs.appendFile('./'+process.argv[4], JSON.stringify(log)+'\n', function(error, data) {
	
		if(error) console.log(error);
		console.log('Logged to ', './'+process.argv[4])
	});
}