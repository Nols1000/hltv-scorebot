var Timer = function() {
	this.time = arguments[0] || 0;
	this.startTime = arguments[0] || 0;
	this.callback  = arguments[1] || this.callback;
}

Timer.prototype = {
	
	tick: function() {
		
		if(this.time > 0) {
			
			this.time = this.time - 1;			
			this.callback(this.time);
		}else {
			
			clearInterval(this.interval);
		}
	},
	start: function() {
		
		if(typeof arguments[0] != "undefined") {
			
			this.time = arguments[0];
			this.startTime = arguments[0];
		}
		
		this.interval  = setInterval(this.tick.bind(this), 1000); 
	},
	stop: function() {
		
		clearInterval(this.interval);
	},
	reset: function() {
		
		this.stop();
		this.time = this.startTime;
	},
	callback: function(time) {
		
		console.log(time, 'left');
	}
}