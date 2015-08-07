var bot = new Scorebot();

function start(matchid) {
	bot.connect({
		'matchid': matchid
	});
	
	document.getElementById('start').classList.add('slidedown');
	document.getElementById('game').classList.add('slideindown');
}

bot.on('score', function(score) {
	
	console.log(score);
	
	document.getElementById('score1').innerHTML = score.t + "";
	document.getElementById('score2').innerHTML = score.ct + "";
});

bot.on('kill', function(ka) {
	
	if(ka.aggressor != null && ka.victim != null) {
		var killMsg = document.createElement('li');
		var p1 = document.createElement('span');
		var p2 = document.createElement('span');
		var weapon = document.createElement('span');
	
		p1.setAttribute('class', ka.aggressor.side.toLowerCase());
		p2.setAttribute('class', ka.victim.side.toLowerCase());
		weapon.setAttribute('class', ka.weapon);
		
		p1.appendChild(document.createTextNode(ka.aggressor.name));
		p2.appendChild(document.createTextNode(ka.victim.name));
		
		killMsg.appendChild(p1);
		killMsg.appendChild(p2);
		killMsg.appendChild(weapon);
		
		document.getElementById('kills').insertBefore(killMsg, document.getElementById('kills').childNodes[0]);
	}
});

bot.on('bombPlanted', function(bia) {
	
	document.getElementById('bomb').setAttribute('class', "planted");
});

bot.on('bombDefused', function(bia) {
	
	document.getElementById('bomb').setAttribute('class', "defused");
});

bot.on('roundStarted', function() {
	
	document.getElementById('bomb').setAttribute('class', "");
	
	if((this.score.t + this.score.ct) == 15) {
		
		switch_sides();
	}
});

bot.on('roundOver', function() {
	
	
});

bot.on('scoreboardUpdated', function(player) {
	
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

bot.on('mapChanged', function(mapAttr) {
	
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