var lr = require('line-reader');
var io = require('socket.io')(process.argv[2]);

var start = Date.now();
var time  = 0;

lr.eachLine(process.argv[3], function(line, last, cb) {
	
	var data = JSON.parse(line);
	var isTrue = true;
	
	while(isTrue) {
		
		if((Date.now() - start) > data.timestamp) {
			
			console.log(data.timestamp, data.event);
			
			io.emit(data.event, data.args);
			isTrue = false;
		}
	}
	
	cb();
});