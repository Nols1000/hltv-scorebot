var io 				= require('socket.io-client');
var EE 				= require('events').EventEmitter;
var inherits     	= require('util').inherits;
var Player 			= require('./lib/Player.js');
var HLTVPlayer		= require('./lib/HLTVPlayer.js');
var KPlayer 		= require('./lib/KPlayer.js');
var APlayer 		= require('./lib/APlayer.js'); 
var PlayerManager 	= require('./lib/PlayerManager.js');

var TERRORIST = 0;
var COUNTERTERRORIST = 1;

var OPTION_MATCHROUNDTIME = 0;
var OPTION_MATCHBOMBTIME = 1;
var OPTION_MATCHFREEZETIME = 2;

function Scorebot() {
	
	this.ip 		= "";
	this.port		= 0;
	this.matchid 	= 0;
	
	this.socket		= null;
	this.reconnect	= false;
	
	this.score 		= {};
	this.player		= new PlayerManager();
	this.map		= "de_dust";
	this.time		= 0;
	this.interval;
	
	this.lastAssister = { 'vID': -1, 'assister': new Player() };
	
	this.options 	= {};
	
	this.score[TERRORIST]					= 0;
	this.score[COUNTERTERRORIST]			= 0;
	
	this.options[OPTION_MATCHROUNDTIME] 	= 105;
	this.options[OPTION_MATCHBOMBTIME] 		= 35;
	this.options[OPTION_MATCHFREEZETIME] 	= 15;
}

inherits(Scorebot, EE);

Scorebot.prototype.connect = function() {
	
	this.ip			= arguments[0];
	this.port 		= arguments[1];
	this.matchid 	= arguments[2];
	
	this.socket		= io(this.ip + ':' + this.port);
	
	this.socket.on('connect', this.onConnect.bind(this));
}

Scorebot.prototype.onConnect = function() {
	
	if(!this.reconnect) {
		
		this.socket.on('log', this.onLog.bind(this));
		this.socket.on('score', this.onScore.bind(this));
		this.socket.on('scoreboard', this.onScoreboard.bind(this));
	}
	
	this.socket.emit('readyForMatch', this.matchid);
}

Scorebot.prototype.onReconnect = function() {
	
	this.reconnect = true;
	this.socket.emit('readyForMatch', this.matchid);
}

Scorebot.prototype.onLog = function(logs) {
	
	logs = logs['log'];
	
	logs.forEach(function (log, index, array){
		
		for(event in log) {
			
			switch(event) {
				
				case 'Kill':
					this.onKill(log[event]);
					break;
				case 'Assist':
					this.onAssist(log[event]);
					break;
				case 'BombPlanted':
					this.onBombPlanted(log[event]);
					break;
				case 'BombDefused':
					this.onBombDefused(log[event]);
					break;
				case 'RoundStart':
					this.onRoundStart(log[event]);
					break;
				case 'RoundEnd':
					this.onRoundEnd(log[event]);
					break;
				case 'PlayerJoin':
					this.onPlayerJoin(log[event]);
					break;
				case 'PlayerQuit':
					this.onPlayerQuit(log[event]);
					break;
				case 'MapChange':
					this.onMapChange(log[event]);
					break;
				case 'Restart':
					this.onServerRestart(log[event]);
					break;
				default: 
					
					break;
			}
		}
	}.bind(this));
}

Scorebot.prototype.onScore = function(score) {
	
	this.score[TERRORIST] 			= score['tScore'];
	this.score[COUNTERTERRORIST]	= score['ctScore'];
	
	this.emit('score', this.score[TERRORIST], this.score[COUNTERTERRORIST]);
}

Scorebot.prototype.onScoreboard = function(player) {
	
	for(var i = 0; i < player["TERRORIST"].length; i++) {
		
		var nPlayer = player["TERRORIST"][i];
		
		// Check for eBot created Players
		if(nPlayer.score != (nPlayer.deaths * -1)) {
			
			var mPlayer = this.player.getByName(nPlayer.name) || new Player();
				nPlayer = new HLTVPlayer(nPlayer.name, TERRORIST, nPlayer.score, nPlayer.deaths, nPlayer.alive);
				mPlayer.mergeHLTVPlayer(nPlayer);
			
			this.player.set(TERRORIST, mPlayer);
		}
	}
	
	for(var i = 0; i < player["CT"].length; i++) {
		
		var nPlayer = player["CT"][i];
		
		// Check for eBot created Players
		if(nPlayer.score != (nPlayer.deaths * -1)) {
			
			var mPlayer = this.player.getByName(nPlayer.name) || new Player();
				nPlayer = new HLTVPlayer(nPlayer.name, COUNTERTERRORIST, nPlayer.score, nPlayer.deaths, nPlayer.alive);
				mPlayer.mergeHLTVPlayer(nPlayer);
			
			this.player.set(COUNTERTERRORIST, mPlayer);
		}
	}
	
	this.emit('player', this.player);
}

Scorebot.prototype.onKill = function(event) {
	
	var killer = new KPlayer(event.killerId, event.killerSteamId, event.killerName, (event.killerSide == "TERRORIST") ? TERRORIST : COUNTERTERRORIST); 
	var victim = new KPlayer(event.victimId, event.victimSteamId, event.victimName, (event.victimSide == "TERRORIST") ? TERRORIST : COUNTERTERRORIST); 
	
	var kPlayer = this.player.getByName(killer.name) || new Player();
		kPlayer.mergeKPlayer(killer);
		
	var vPlayer = this.player.getByName(victim.name) || new Player();
		vPlayer.mergeKPlayer(victim);
	
	this.player.set(killer.team, kPlayer);
	this.player.set(victim.team, vPlayer);
	this.emit('player', this.player);
	
	if(this.lastAssister.vID == vPlayer.id) {
		
		this.emit('kill', kPlayer, vPlayer, event.weapon, event.headshot, this.lastAssister.assister);
	} else {
		
		this.emit('kill', kPlayer, vPlayer, event.weapon, event.headshot);
	}
}

Scorebot.prototype.onAssist = function(event) {
	
	var assister	= new APlayer(event.assisterId, event.assisterName, (event.assisterSide == "TERRORIST") ? TERRORIST : COUNTERTERRORIST)
	var victim		= new APlayer(event.victimId, event.victimName, (event.victimSide == "TERRORIST") ? TERRORIST : COUNTERTERRORIST);
	
	var aPlayer = this.player.getByName(assister.name) || new Player();
		aPlayer.mergeAPlayer(assister);
		
	var vPlayer = this.player.getByName(victim.name) || new Player();
		vPlayer.mergeAPlayer(victim);
		
	this.player.set(assister.team, aPlayer);
	this.player.set(victim.team, vPlayer);
	this.emit('player', this.player);
	
	this.lastAssister = { 'vID': vPlayer.id, 'assister': aPlayer };
	this.emit('assist', aPlayer, vPlayer);
}

Scorebot.prototype.onBombPlanted = function(event) {
	
	this.setTime(this.options[OPTION_MATCHBOMBTIME]);
	this.emit('bombplanted', this.player.getByName(event.player));
}

Scorebot.prototype.onBombDefused = function() {
	
	this.emit('bombdefused', this.player.getByName(event.player));
}

Scorebot.prototype.onRoundStart = function() {
	
	this.setTime(this.options[OPTION_MATCHROUNDTIME]);
	this.emit('roundstart')
}

Scorebot.prototype.onRoundEnd = function(event) {
	
	this.setTime(this.options[OPTION_MATCHFREEZETIME]);
	this.emit('roundend', (event.winner == "TERRORIST" ? TERRORIST : COUNTERTERRORIST), event.terroristScore, event.counterTerroristScore);
}

Scorebot.prototype.onPlayerJoin = function(event) {
	
	this.emit('playerjoin', event.player);
}

Scorebot.prototype.onPlayerQuit = function(event) {
	
	this.emit('playerquit', this.player.getByName(event.player));
	
	
	this.player.del(event.playerName);
	this.emit('player', this.player);
}

Scorebot.prototype.onServerRestart = function() {
	
	this.emit('restart');
}

Scorebot.prototype.onMapChange = function(event) {
	
	this.map = event.mapName;
	this.emit('map', this.map);
}

Scorebot.prototype.setTime = function(time) {
	
	clearInterval(this.interval);
	
	this.time 	 	= time;
	this.interval 	= setInterval(function() {
		
		this.time = this.time - 1;
		this.emit('time', this.time);
	}.bind(this), 1000);
}

Scorebot.prototype.Player 			= Player;
Scorebot.prototype.HLTVPlayer 		= HLTVPlayer;
Scorebot.prototype.KPlayer 			= KPlayer;
Scorebot.prototype.APlayer			= APlayer;
Scorebot.prototype.PlayerManager	= PlayerManager;

module.exports = Scorebot;