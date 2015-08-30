var TERRORIST = 0;
var COUNTERTERRORIST = 1;

function sort(a, b) {
		
	if (a.kills > b.kills) {
		
		return -1;
	} else if (a.kills < b.kills) {
		
		return 1;
	} else if (a.deaths < b.deaths) {
		
		return -1;
	} else if (a.deaths > b.deaths) {
		
		return 1;
	}
	// a must be equal to b
	return 0;
}

function PlayerManager() {
	
	this.playerList = {};
	
	this.playerList[TERRORIST] 			= [];
	this.playerList[COUNTERTERRORIST] 	= [];
}

PlayerManager.prototype.TERRORIST			= TERRORIST;
PlayerManager.prototype.COUNTERTERRORIST	= COUNTERTERRORIST;

PlayerManager.prototype.set = function(team, player) {
	
	var index = this.getIndex(player.name);
	
	if(index.team == team) {
		
		var team  = index.team;
		var index = index.index;
		
		this.playerList[team][index] = player;
	} else if(index.team > -1) {
		
		del(player.name);
		
		var index = this.playerList[team].length;
		this.playerList[team][index] = player; 
	} else {
		
		var index = this.playerList[team].length;
		this.playerList[team][index] = player; 
	}
	
	this.playerList[TERRORIST].sort(sort);
	
	this.playerList[COUNTERTERRORIST].sort(sort);
}

PlayerManager.prototype.get = function(team, index) {
	
	return this.playerList[team][index];
}

PlayerManager.prototype.getIndex = function(name) {
	
	for(var i = 0; i < this.playerList[TERRORIST].length; i++) {
		
		var player = this.playerList[TERRORIST][i];
		
		if(player.name == name) {
			return {
				'team': TERRORIST,
				'index': i
			};
		}
	}
	
	for(var i = 0; i < this.playerList[COUNTERTERRORIST].length; i++) {
		
		var player = this.playerList[COUNTERTERRORIST][i];
		
		if(player.name == name) {
			return {
				'team': COUNTERTERRORIST,
				'index': i
			};
		}
	}
	
	return {
		'team': -1,
		'index': -1
	};
}

PlayerManager.prototype.getByName = function(name) {
	
	var index = this.getIndex(name);
	var team  = index.team;
	var index = index.index;
	
	if(team > -1) {
		
		return this.get(team, index);
	} else {
		
		return null;
	}
}

PlayerManager.prototype.getByNameAsync = function(name, cb) {
	
	var player = this.getByName(name);
	
	if(player != null) {
		
		cb(false, player);
	}else {
		
		cb('Player not found', null);
	}
}

PlayerManager.prototype.del = function(name) {
	
	var index = this.getIndex(name);
	var team  = index.team;
	var index = index.index;
	
	if(team > -1) {
		
		this.playerList[team].splice(index, 1);
		return true;
	} else {
		
		return false;
	}
} 

module.exports = PlayerManager;