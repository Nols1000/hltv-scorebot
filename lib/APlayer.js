function APlayer() {
	
	this.id		= arguments[0];
	this.name	= arguments[1];
	this.team 	= arguments[2];
}

module.exports = APlayer;

console.log('Loaded APlayer');