function HLTVPlayer() {
	
	this.name 	= arguments[0];
	this.team	= arguments[1];
	this.kills	= arguments[2];
	this.deaths = arguments[3];
	this.alive	= arguments[4];
}

module.exports = HLTVPlayer;

console.log('Loaded HLTVPlayer');