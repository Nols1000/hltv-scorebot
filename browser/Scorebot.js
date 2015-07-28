String.prototype.strip = function() {
	if(!this.length) return "";
	return this.replace(/<\/?[^>]+(>|$)/g, "");
}

Player = function () {
    
	this.id      = arguments[0];
    this.side    = arguments[1];
    this.name    = arguments[2];
    this.kills   = arguments[3];
    this.deaths  = arguments[4];
    this.death   = false;
    this.element = null;
}

Log = function () {
    
	this.id        = arguments[0];
    this.round     = arguments[1];
    this.roundTime = arguments[2];
    this.type      = arguments[3];
    this.side      = arguments[4];
    this.html      = arguments[5];
    this.text      = arguments[6];
    this.attr      = arguments[7];
}

function Scorebot() {
	
	this.port           = 10022;
	this.url            = 'http://scorebot.hltv.org';
	this.matchid		= 0;
	
	this.reconnected    = false;
	this.socket         = null;
	this.matchRoundTime = 105;
	this.matchBombTime  = 35;
	this.roundTime      = 0;
	this.knifeKills     = 0;
	this.matchRoundOver = false;
	this.bombPlanted    = false;
	this.knifeRound     = false;
	this.logs           = [];
	
	this.score 			= { ct: '0', t: '0' };
	this.player         = { ct: [], t: []};
	
	this.__ee 			= new EventEmitter();
}

Scorebot.prototype = {
	connect: function(options) {
		
		this.port		= options.port || 10022;
		this.url		= options.url  || 'http://scorebot.hltv.org';
		this.matchid	= options.matchid;
		
		this.socket = io.connect(this.url + ':' + this.port);

		this.socket.on('connect', function(res) {
			if (!this.reconnected) {
				
				this.socket.on('log', function(msg) {
					for (var l = 0; l < msg.lines.length; l++) {
						var id          = l;
						var line        = msg.lines[l];
						var type        = "default";
						var side        = "unknown";
						var html        =  line;
						var text        =  line.strip();
						
						console.log(text);
						
						var defaultAttr = {};
						
						var killAttr = {
							'headshot'  : false,
							'weapon'    : 'ak47',
							'aggressor' : 'Player1',
							'victim'    : 'Player2'
						};
						
						var bombInteractionAttr = {
							'player' : 'Player1' 
						};
						
						var connectionAttr = {
							'player' : 'Player1' 
						};
						
						var mapAttr = {
							'map' : 'de_dust2'
						};
						
						var winner = {
							'side' : 'T'
						};
						
						var scores = {
							't' : this.score.t,
							'ct' : this.score.ct
						};
						
						if (text.indexOf('Map changed to:') != -1) {
							type        = "mapChanged";
							side        = "both";
							mapAttr.map = text.substring(16, text.length);
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, defaultAttr);
							this.logs.push(log);
							
							this.emit(type, mapAttr);
						}
						
						if (text.indexOf('Game restarted')) {
							type = "restarted";
							side = "both";
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, defaultAttr);
							this.logs.push(log);
							
							this.emit(type);
						}
						
						if (text.indexOf('Round over') != -1) {
							
							this.matchRoundOver = true;
							
							type           = "roundOver";
							side           = "both";
							
							if (text.indexOf('Winner: T') != -1) {
								winner.side = 'T';
								scores.t = parseInt(parseInt(scores.t) + 1).toString();
							} else if (text.indexOf('Winner: CT') != -1) {
								winner.side = 'CT';
								scores.ct = parseInt(parseInt(scores.ct) + 1).toString();
							} else if (text.indexOf('Winner: DRAW') != -1) {
								winner.side = 'CT';
								scores.ct = parseInt(parseInt(scores.ct) + 1).toString();
							}

							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, defaultAttr);
							this.logs.push(log);
							
							this.emit(type, winner);
						}
						
						if (text.indexOf('Round started') != -1) {
							this.roundTime      = this.matchRoundTime;
							this.matchRoundOver = false;
							this.bombPlanted    = false;
							this.knifeRound     = false;
							this.knifeKills     = 0;
							
							type           = "roundStarted";
							side           = "both";
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, defaultAttr);
							this.logs.push(log);

							this.emit(type);
						}
						
						if (line.indexOf('killed') != -1) {
							type = 'kill';
							
							var i = text.indexOf('killed');
							killAttr.aggressor = this.getPlayer(text.substring(0, i - 1));
							
							var j = text.indexOf('with');
							killAttr.victim = this.getPlayer(text.substring(i + 6 + 1, j - 1));
							
							if (killAttr.victim != null) {
								killAttr.victim.death = true;
							}
							
							var k = text.indexOf('(');
							
							if (k != -1) {
								killAttr.headshot = true;
								killAttr.weapon   = text.substring(j + 4 + 1, k - 1);
							} else {
								killAttr.headshot = false;
								killAttr.weapon   = text.substring(j + 4 + 1, text.length);
							}
							
							if (killAttr.weapon.indexOf("knife") > -1 || killAttr.weapon.indexOf("bayonet") > -1 || killAttr.weapon.indexOf("karam") > -1 || killAttr.weapon.indexOf("flip") > -1 || killAttr.weapon.indexOf("tactical") > -1 || killAttr.weapon.indexOf("huntsman") > -1 || killAttr.weapon.indexOf("falchion") > -1 || killAttr.weapon.indexOf("butterfly") > -1) {
								this.knifeKills++;
							}
							
							if (knifeKills >= 3) {
								this.knifeRound = true;
							}
							
							if (killAttr.aggressor != null) {
								side = killAttr.aggressor.side.toLowerCase();
							}
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, killAttr);
							this.logs.push(log);
							
							this.emit(type, killAttr);
						}

						if (line.indexOf('planted the bomb') != -1) {
							this.roundTime   = matchBombTime;
							this.bombPlanted = true;
							
							type = "bombPlanted";
							side = "t";
							
							var i = text.indexOf('planted the bomb');
							bombInteractionAttr.player = this.getPlayer(text.substring(0,i-1));
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, bombInteractionAttr);
							this.logs.push(log);
							
							this.emit(type, bombInteractionAttr);
						}
						
						if (line.indexOf('defused the bomb') != -1) {
							type = "bombDefused";
							side = "ct";
							
							var i = text.indexOf('defused the bomb');
							bombInteractionAttr.player = this.getPlayer(text.substring(0, i - 1));
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, bombInteractionAttr);
							this.logs.push(log);
							
							this.emit(type, bombInteractionAttr);
						}
						
						if (text.indexOf('changed name to') != -1) {
							type = "nameChange";
							
							var names    = text.replace("changed name to ", "");
							var oldName  = names.split(" ")[0];
							var newName  = names.split(" ")[1];
							var nameAttr = {
								'old': oldName,
								'new': newName
							};
							
							this.getPlayer(oldName).name = newName;
							
							this.emit(type, nameAttr);
						}
						
						if (text.indexOf('has left the game') != -1) {
							type = "playerLeft";
							
							var i = text.indexOf('has left the game');
							connectionAttr.player = this.getPlayer(text.substring(0, i - 1));
							
							if (connectionAttr.player != null) {
								side = connectionAttr.player.side.toLowerCase();
							}
							
							var log = new Log(id, this.score.t + this.score.ct + 1, this.roundTime, type, side, html, text, connectionAttr);
							this.logs.push(log);
							
							this.emit(type, connectionAttr);
						}
					}
				}.bind(this));

				this.socket.on('score', function (s) {
					this.score.t  = s.tScore;
					this.score.ct = s.ctScore;
					
					this.emit('score', this.score);
				}.bind(this));

				this.socket.on('scoreboard', function (scoreboard) {
					
					for (var i = 0; i < scoreboard['CT'].length; i++) {
						
						var player = scoreboard['CT'][i];
						player = new Player(player['id'], 'CT', player['name'], player['score'], player['deaths']);
						
					}
					
					for (var i = 0; i < scoreboard['TERRORIST'].length; i++) {
						var p = scoreboard['TERRORIST'][i];
						p = new Player(player['id'], 'T', player['name'], player['score'], player['deaths']);
					}
					
					this.player.t.sort(killDifference);
					this.player.ct.sort(killDifference);
				}.bind(this));
				
				this.socket.emit('readyForMatch', this.matchid);
			}
		}.bind(this));

		this.socket.on('reconnect', function () {
			this.reconnected = true;
			this.socket.emit('readyForMatch', this.matchid);
		}.bind(this));

		this.socket.on('reconnect', function () {
			this.reconnected = true;
			this.socket.emit('readyForMatch', this.matchid)
		}.bind(this));
	},
	on: function(event, callback) {
		
		this.__ee.addListener(event, callback);
	},
	emit: function() {
		
		if(arguments.length == 0)
			return false;
		
		var event;
		var args = [];
		
		for (var i = 0; i < arguments.length; i++) {
			
			if(i == 0) {
				
				event = arguments[i];
			}else {
				
				args.push(arguments[i]);
			}
		}
		
		this.__ee.emitEvent(event, args)
	},
	getPlayer: function(name) {
		
		for (var i = 0; i < this.player.ct.length; i++) {
			if (name.indexOf(this.player.ct[i].name) != -1) {
				return this.player.ct[i];
			}
		}
	
		for (var j = 0; j < this.player.t.length; j++) {
			if (name.indexOf(this.player.t[j].name) != -1) {
				return this.player.t[j];
			}
		}
		
		return null;
	},
	updateScoreboard: function(newPlayer) {
		
		var oldPlayer = this.getPlayer(newPlayer.name);
		
		if(oldPlayer != null) {
			
			if(oldPlayer.side != newPlayer.side) {
				
				
			}else {
				
				oldPlayer = newPlayer;
			}
		}
	}
}

function killDifference (obj, otherObj) {
	var killDiff = parseInt(otherObj.kills, 10) - parseInt(obj.kills, 10);

	if (killDiff == 0) {
		return parseInt(obj.deaths, 10) - parseInt(otherObj.deaths, 10);
	} else {
		return killDiff;
	}
}