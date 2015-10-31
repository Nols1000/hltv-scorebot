var bot = new Scorebot();

function start(source, matchid) {
	
	var ip 		= "localhost";
	var port	= 10023;
	
	if(source == 0) { // Local
		
		ip 		= "http://localhost";
		port	= 10023;
	}else if(source == 1) {
		
		ip		= "http://scorebot.hltv.org";
		port 	= 10023;
	}
	
	console.log(ip+':'+port);
	
	bot.connect(ip, port, matchid);
	
	document.getElementById('start').classList.add('slidedown');
	document.getElementById('game').classList.add('slideindown');
}

bot.on('score', function(score) {
	
	console.log(score);
	
	document.getElementById('score1').innerHTML = score.t + "";
	document.getElementById('score2').innerHTML = score.ct + "";
});

bot.on('kill', function(kill, victim, weapon, headshot, assister) {
	
	if(killer != null && victim != null) {
		var killMsg = document.createElement('li');
		var p1 = document.createElement('span');
		var p2 = document.createElement('span');
		var weapon = document.createElement('span');
	
		p1.setAttribute('class', killer.team ? 'ct' : 'terrorist');
		p2.setAttribute('class', victim.team ? 'ct' : 'terrorist');
		weapon.setAttribute('class', weapon);
		
		p1.appendChild(document.createTextNode(killer.name));
		p2.appendChild(document.createTextNode(victim.name));
		
		killMsg.appendChild(p1);
		killMsg.appendChild(p2);
		killMsg.appendChild(weapon);
		
		document.getElementById('kills').insertBefore(killMsg, document.getElementById('kills').childNodes[0]);
	}
});

bot.on('bombplanted', function(player) {
	
	document.getElementById('bomb').setAttribute('class', "planted");
});

bot.on('bombdefused', function(player) {
	
	document.getElementById('bomb').setAttribute('class', "defused");
});

bot.on('roundstarted', function() {
	
	document.getElementById('bomb').setAttribute('class', "");
});

bot.on('roundover', function(winner, tScore, ctScore) {
	
	document.getElementById('kills').innerHTML = '';
});

bot.on('player', function(pm) {
	
	var html = {
		'ct': document.getElementById('t_player_ct'),
		't' : document.getElementById('t_player_t')
	};
	
	html.ct.innerHTML = '';
	html.t.innerHTML = '';
	
	for(var i = 0; i < player.ct.length; i++) {
		
		var outerWrapper = document.createElement('tr');
		var nameWrapper = document.createElement('td');
		var killWrapper = document.createElement('td');
		var deathWrapper = document.createElement('td');
		var pointWrapper = document.createElement('td');
		
		nameWrapper.appendChild(document.createTextNode(player.ct[i].name));
		killWrapper.appendChild(document.createTextNode(player.ct[i].kills));
		deathWrapper.appendChild(document.createTextNode(player.ct[i].deaths));
		pointWrapper.appendChild(document.createTextNode(player.ct[i].kills * 3));
		
		killWrapper.setAttribute('class', 'small');
		deathWrapper.setAttribute('class', 'small');
		pointWrapper.setAttribute('class', 'small');
		
		outerWrapper.appendChild(nameWrapper);
		outerWrapper.appendChild(killWrapper);
		outerWrapper.appendChild(deathWrapper);
		outerWrapper.appendChild(pointWrapper);
		
		html.ct.appendChild(outerWrapper);
	}
	
	for(var i = 0; i < player.t.length; i++) {
		
		var outerWrapper = document.createElement('tr');
		var nameWrapper = document.createElement('td');
		var killWrapper = document.createElement('td');
		var deathWrapper = document.createElement('td');
		var pointWrapper = document.createElement('td');
		
		nameWrapper.appendChild(document.createTextNode(player.t[i].name));
		killWrapper.appendChild(document.createTextNode(player.t[i].kills));
		deathWrapper.appendChild(document.createTextNode(player.t[i].deaths));
		pointWrapper.appendChild(document.createTextNode(player.t[i].kills * 3));
		
		killWrapper.setAttribute('class', 'small');
		deathWrapper.setAttribute('class', 'small');
		pointWrapper.setAttribute('class', 'small');
		
		outerWrapper.appendChild(nameWrapper);
		outerWrapper.appendChild(killWrapper);
		outerWrapper.appendChild(deathWrapper);
		outerWrapper.appendChild(pointWrapper);
		
		html.t.appendChild(outerWrapper);
	}
	
})

bot.on('time', function(time) {
	
	var min = Math.floor(time / 60);
	var sec = time % 60;
	
	if(sec < 10) 
		sec = '0' + sec;
	
	document.getElementById('time').innerHTML = min + ':' + sec;
});

bot.on('map', function(mapAttr) {
	
	document.getElementById('game').setAttribute('class', mapAttr.map);
});

function switch_sides() {
	
	var old1 = {
		't': document.getElementById('team1').innerHTML,
		's': document.getElementById('score1').innerHTML
	};
	
	var old2 = {
		't': document.getElementById('team2').innerHTML,
		's': document.getElementById('score2').innerHTML
	};
	
	document.getElementById('team1').innerHTML = old2.t;
	document.getElementById('score1').innerHTML = old2.s;
	document.getElementById('team2').innerHTML = old1.t;
	document.getElementById('score2').innerHTML = old1.s;
}