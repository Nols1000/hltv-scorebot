function Player() {
	
	this.id 		= arguments[0] || 0;
	this.steamID	= arguments[1] || '';
	this.name		= arguments[2] || '';
	this.team		= arguments[3] || -1;
	this.kills		= arguments[4] || 0;
	this.assists	= arguments[5] || 0;
	this.deaths		= arguments[6] || 0;
	this.alive		= arguments[7] || false;
}

Player.prototype.mergeHLTVPlayer = function(player) {
	
	this.name 	= player.name;
	this.team 	= player.team;
	this.kills	= player.kills;
	this.deaths = player.deaths;
	this.alive	= player.alive;
}

Player.prototype.mergeKPlayer = function(player) {
	
	this.id 		= player.id;
	this.steamID	= player.steamID;
	this.name 		= player.name;
	this.team		= player.team;
}

Player.prototype.mergeAPlayer = function(player) {
	
	this.id 		= player.id;
	this.name 		= player.name;
	this.team		= player.team;
	this.assists	= this.assists + 1;
}

module.exports = Player;