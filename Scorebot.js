var io           = require('socket.io-client');
var EventEmitter = require('events').EventEmitter;
var ee           = new EventEmitter();

var matchRoundTime = 105;
var matchBombTime  = 35;
var roundTime      = 0;
var knifeKills     = 0;
var matchRoundOver = false;
var bombPlanted    = false;
var knifeRound     = false;
var logs           = [];

var score  = {
	't':  0,
	'ct':  0
};
var player = {
	't' : [], 
	'ct': [],
	'h' : []
};

require('./lib/player');
require('./lib/log');

String.prototype.strip = function() {
	if(!this.length) return "";
	return this.replace(/<\/?[^>]+(>|$)/g, "");
}

/*********************
** Define functions **
*********************/

module.exports = function() {
	
}

module.exports.connect = function(url, matchid, events, displayText) {
	var socket      = io(url);
	var reconnected = false;
	
	socket.on('connect', function(res) {
		events.emit('connect', socket, true);
		
		if (!reconnected) {
			socket.on('log', function(log) {
                for (var l = 0; l < log.lines.length; l++) {
					var id          = 0;
					var line        = log.lines[l];
					var type        = "default";
					var side        = "unknown";
					var html        =  line;
					var text        =  html.strip();
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
						't' : score.t,
						'ct' : score.ct
					};
					
					if (displayText) {
						console.log(text);
					}
					
					if (text.indexOf('Map changed to:') != -1) {
						type        = "mapChanged";
						side        = "both";
						mapAttr.map = text.substring(16, text.length);
						
						ee.emit(type, mapAttr);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, defaultAttr);
						logs.push(nLog);
					}
					
					if (text.indexOf('Game restarted')) {
						type = "restarted";
						side = "both";
						
						ee.emit(type);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, defaultAttr);
						logs.push(nLog);
					}
					
					if (text.indexOf('Round over') != -1) {
						matchRoundOver = true;
						type           = "roundOver";
						side           = "both";
						
						if (text.indexOf('Winner: T') != -1) {
							winner.side = 'T';
							scores.t = parseInt(parseInt(scores.t) + 1).toString();
							
							ee.emit(type, winner, scores, knifeRound);
						} else if (text.indexOf('Winner: CT') != -1) {
							winner.side = 'CT';
							scores.ct = parseInt(parseInt(scores.ct) + 1).toString();
							
							ee.emit(type, winner, scores, knifeRound);
						} else if (text.indexOf('Winner: DRAW') != -1) {
							winner.side = 'CT';
							scores.ct = parseInt(parseInt(scores.ct) + 1).toString();
						}

						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, defaultAttr);
						logs.push(nLog);
					}
					
					if (text.indexOf('Round started') != -1) {
						roundTime      = matchRoundTime;
						matchRoundOver = false;
                        bombPlanted    = false;
						type           = "roundStarted";
						side           = "both";
						knifeRound     = false;
						knifeKills     = 0;
						
						ee.emit(type);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, defaultAttr);
						logs.push(nLog);
						
						resetPlayerDeathAttr();
						
					}
					
					if (line.indexOf('killed') != -1) {
						type = 'kill';
						
						var i = text.indexOf('killed');
					    killAttr.aggressor = module.exports.getPlayerByName(text.substring(0, i - 1));
						
						var j = text.indexOf('with');
						killAttr.victim = module.exports.getPlayerByName(text.substring(i + 6 + 1, j - 1));
						
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
							knifeKills++;
						}
						
						if (knifeKills >= 3) {
							knifeRound = true;
						}
						
						if (killAttr.aggressor != null) {
							side = killAttr.aggressor.side.toLowerCase();
						}
						
						ee.emit(type, killAttr)
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, killAttr);
						logs.push(nLog);
					}

                    if (line.indexOf('planted the bomb') != -1) {
                        roundTime   = matchBombTime;
                        bombPlanted = true;
						
						type = "bombPlanted";
						side = "t";
						
						var i = text.indexOf('planted the bomb');
						bombInteractionAttr.player = module.exports.getPlayerByName(text.substring(0,i-1));
						
						ee.emit(type, bombInteractionAttr);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, bombInteractionAttr);
						logs.push(nLog);
                    }
					
					if (line.indexOf('defused the bomb') != -1) {
						type = "bombDefused";
						side = "ct";
						
						var i = text.indexOf('defused the bomb');
						bombInteractionAttr.player = module.exports.getPlayerByName(text.substring(0, i - 1));
						
						ee.emit(type, bombInteractionAttr);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, bombInteractionAttr);
						logs.push(nLog);
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
                    	
                    	ee.emit(type, nameAttr);
                    }
					
					if (text.indexOf('has left the game') != -1) {
						type = "playerLeft";
						
						var i = text.indexOf('has left the game');
						connectionAttr.player = module.exports.getPlayerByName(text.substring(0, i - 1));
						
						if (connectionAttr.player != null) {
							side = connectionAttr.player.side.toLowerCase();
						}
						
						ee.emit(type, connectionAttr);
						
						var nLog = new Log(id, score.t + score.ct + 1, roundTime, type, side, html, text, connectionAttr);
						logs.push(nLog);
					}
				}
            });

            socket.on('score', function (s) {
				score.t  = s.tScore;
				score.ct = s.ctScore;

				ee.emit("scoreUpdate", s.tScore, s.ctScore);
            });

            socket.on('scoreboard', function (scoreboard) {
				var nPlayer = {'t': [], 'ct': []};
				
                for (var i = 0; i < scoreboard['CT'].length; i++) {
                    var p = scoreboard['CT'][i];
					p = new Player(p['id'], 'CT', p['name'], p['score'], p['deaths']);
                    updatePlayerList(p);
                }
				
				for (var i = 0; i < scoreboard['TERRORIST'].length; i++) {
                    var p = scoreboard['TERRORIST'][i];
                    p = new Player(p['id'], 'T', p['name'], p['score'], p['deaths']);
                    updatePlayerList(p);
                }
				
                // sort players with most kills highest.
                player.t.sort(killDifference);
                player.ct.sort(killDifference);
				
				ee.emit('playerUpdate', player);
            });
			
			socket.emit('readyForMatch', matchid);
        }
    });

    socket.on('reconnect', function () {
		reconnected = true;
        socket.emit('readyForMatch', matchid);
    });
}

module.exports.on = function(event, trigger) {
	ee.on(event, trigger);
}

module.exports.getPlayerByName = function(name) {
	for (var i = 0; i < player.ct.length; i++) {
		if (name.indexOf(player.ct[i].name) != -1) {
			return player.ct[i];
		}
	}
	
	for (var j = 0; j < player.t.length; j++) {
		if (name.indexOf(player.t[j].name) != -1) {
			return player.t[j];
		}
	}
	
	return null;
}

function updateAllPlayer () {
	console.log("+ CT - " + setLength(score.ct, 2) + " -------------------------------------------------------------------+");
	
	for (var j = 0; j < player.ct.length; j++) {
		var p = player.ct[j];
		console.log("| " + setLength(p.id + "", 2) + " | " + setLength(p.side, 2) + " | " + setLength(p.name, 50) + " | " + setLength(p.kills + "", 3) + " | " + setLength(p.deaths + "", 3) + " |" + stringBoolean(p.death) + "|");
	}

	console.log("+ T  - " + setLength(score.t, 2) + " -------------------------------------------------------------------+");

	for (var j = 0; j < player.t.length; j++) {
		var p = player.t[j];
		console.log("| " + setLength(p.id + "", 2) + " | " + setLength(p.side, 2) + " | " + setLength(p.name, 50) + " | " + setLength(p.kills + "", 3) + " | " + setLength(p.deaths + "", 3) + " |" + stringBoolean(p.death) + "|");
	}
	
	console.log("+----------------------------------------------------------------------------+");
}

function resetPlayerDeathAttr () {
	for (var i = 0; i < player.ct.length; i++) {
		player.ct[i].death = false;
	}
	
	for (var j = 0; j < player.t.length; j++) {
		player.t[j].death = false;
	}
}

function updatePlayerList (p) {
	if (module.exports.getPlayerByName(p.name) != null) {
		for (var i = 0; i < player.ct.length; i++) {
			if (p.name.indexOf(player.ct[i].name) != -1) {
				if (p.side.indexOf("CT") != -1) {
					if (typeof player.ct[i] != "undefined") {
						player.ct[i].id     = p.id;
						player.ct[i].side   = p.side;
						player.ct[i].name   = p.name;
						player.ct[i].kills  = p.kill;
						player.ct[i].deaths = p.deaths;
					} else {
						player.ct[i] = p;
					}
				} else {
					if (typeof player.ct[i] != "undefined") {
						p.death = player.ct[i].death;
					}
					
					player.ct.splice(i, 1);
					player.t.push(p);
				}			
			}
		}
	
		for (var j = 0; j < player.t.length; j++) {
			if (p.name.indexOf(player.t[j].name) != -1) {
				if (p.side.indexOf("T") != -1) {
					if (typeof player.t[i] != "undefined") {
						player.t[i].id     = p.id;
						player.t[i].side   = p.side;
						player.t[i].name   = p.name;
						player.t[i].kills  = p.kill;
						player.t[i].deaths = p.deaths;
					} else {
						player.t[i] = p;
					}
				} else {
					if (typeof player.t[i] != "undefined") {
						p.death =  player.t[i].death;
					}
					
					player.t.splice(i, 1);
					player.ct.push(p);
				}
			}
		}
	} else {
		if (p.side.indexOf("CT") != -1) {
			player.ct.push(p);
		} else {
			player.t.push(p);
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

function setLength (str, length) {
	for (var i = str.length; i < length; i++) {
		str = str + " ";
	}

	return str;
}

function stringBoolean (bool) {
	if (bool) {
		return "X";
	} else {
		return " ";
	}
}
