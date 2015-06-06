io = require('socket.io-client');

var logLength = 1500;
var oldPlayers = [];
var players = [];

var matchRoundtime = 105;
var matchBombtime = 35;

var Player = function () {
    this.id = arguments[0];
    this.side = arguments[1];
    this.name = arguments[2];
    this.kills = arguments[3];
    this.deaths = arguments[4];
    this.element = null;
}

var reconnected = false;

function stopBot() {
    socket.disconnect();
}

function startBot() {
    socket = io('http://scorebot.hltv.org:10022');

    socket.on('connect', function (res) {
        
		console.log("connected");
		
		if (!reconnected) {
            socket.on('log', function (log) {
                
				console.log("LOG: "+JSON.stringify(log));
				/*var logHtml = '';
                for (var i = 0; i < log.lines.length; i++) {
                    var line = log.lines[i]
                    logHtml += line + "<br/>";

                    if(line.indexOf('Round started') != -1) {
                        //new round started, start timer!
                        roundTime = matchRoundtime;
                        bombPlanted = false;
                    }

                    if(line.indexOf('planted the bomb') != -1) {
                        //new round started, start timer!
                        roundTime = matchBombtime;
                        bombPlanted = true;
                    }
                }

                document.getElementById('gamelog').innerHTML = document.getElementById('newgamelog').innerHTML + document.getElementById('gamelog').innerHTML.substring(0, logLength) + '...';
                document.getElementById('newgamelog').innerHTML = logHtml;
                new Effect.Highlight('newgamelog');*/
            });

            socket.on('score', function (score) {
				
				console.log("SCR: ");
				console.log("T : "+score.tScore);
				console.log("CT: "+score.ctScore);
				
			
                /*if (document.getElementById('ctscore').innerHTML != score['ctScore']) {
                    document.getElementById('ctscore').innerHTML = score['ctScore'];
                    new Effect.Highlight('ctscore');
                }
                if (document.getElementById('tscore').innerHTML != score['tScore']) {
                    document.getElementById('tscore').innerHTML = score['tScore'];
                    new Effect.Highlight('tscore');
                }*/
            });

            socket.on('scoreboard', function (scoreboard) {
			
				console.log("SCB: ");
				
                players = []
                for (var i = 0; i < scoreboard['CT'].length; i++) {
                    var player = scoreboard['CT'][i];
                    players.push(new Player(player['id'], 'CT', player['name'], player['score'], player['deaths']));
                }
                for (var i = 0; i < scoreboard['TERRORIST'].length; i++) {
                    var player = scoreboard['TERRORIST'][i];
                    players.push(new Player(player['id'], 'TERRORIST', player['name'], player['score'], player['deaths']));
                }
				
                // sort players with most kills highest.
                players.sort(function (obj, otherObj) {
                    // if obj > otherObj then -1
                    var killDiff = parseInt(otherObj.kills, 10) - parseInt(obj.kills, 10);

                    if (killDiff == 0) {
                        return parseInt(obj.deaths, 10) - parseInt(otherObj.deaths, 10);
                    } else {
                        return killDiff;
                    }
                });
				
				/*
					this.id = arguments[0];
					this.side = arguments[1];
					this.name = arguments[2];
					this.kills = arguments[3];
					this.deaths = arguments[4];
					this.element = null;
				*/
				
				console.log("+-----------------------------------------------------------------+");
				
				for(var j = 0; j < players.length; j++) {
					
					var p = players[j];
					
					console.log("| "+p.id+" | "+p.side+" | "+p.name+" | "+p.kills+" | "+p.deaths+" |");
				}
				
				console.log("+-----------------------------------------------------------------+");

                /*var tRow = document.getElementById('keep2');
                var ctRow = document.getElementById('keep3');
                var bottomRow = document.getElementById('keep4');
                var table = tRow.parentNode;
                // Remove old players
                for (var i = 0; i < oldPlayers.length; i++) {
                    table.removeChild(oldPlayers[i].element);
                }

                // Insert the new player rows
                for (var i = 0; i < players.length; i++) {
                    players[i].element = getPlayerRow(players[i]);
                    if (players[i].side == 'CT') {
                        table.insertBefore(players[i].element, bottomRow);
                    } else {
                        table.insertBefore(players[i].element, ctRow);
                    }
                }

                oldPlayers = players;*/
            });
			
			socket.emit('readyForMatch', 359350);
        }
    });

    socket.on('reconnect', function () {
        reconnected = true;
        socket.emit('readyForMatch', 359350);
    });
}

startBot();
