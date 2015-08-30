function KPlayer() {
	
	this.id 		= arguments[0];
	this.steamID	= arguments[1];
	this.name		= arguments[2];
	this.team		= arguments[3];
}

module.exports = KPlayer;

console.log('Loaded KPlayer');