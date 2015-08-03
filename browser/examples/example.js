var bot = new Scorebot();

function start(matchid) {
	bot.connect({
		'matchid': matchid
	});
	
	document.getElementById('start').classList.add('slidedown');
	document.getElementById('game').classList.add('slideindown');
}

bot.on('score', function(score) {
	
	document.getElementById('tscore').innerHTML = score.t;
	document.getElementById('ctscore').innerHTML = score.ct;
});

bot.on('kill', function(ka) {
	
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
	
	document.getElementById('kills').appendChild(killMsg);
})

bot.on('bombPlanted', function(bia) {
	
	document.getElementById('bomb').classList.add('planted');
});

bot.on('bombDefused', function(bia) {
	
	document.getElementById('bomb').classList.remove('planted');
	document.getElementById('bomb').classList.add('defused');
});

bot.on('roundStarted', function() {
	
	document.getElementById('bomb').classList = [];
});

bot.on('roundOver', function() {
	
	
});

bot.on('scoreboardUpdated', function(player) {
	
	var html = {
		'ct': document.getElementById('scoreboard_ct'),
		't' : document.getElementById('scoreboard_t')
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
	
	document.getElementById('time').innerHTML = time;
});