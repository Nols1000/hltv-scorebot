var bot = new Scorebot();

function start(matchid) {
	bot.connect({
		'matchid': matchid
	});
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

bot.on('time', function(time) {
	
	document.getElementById('time').innerHTML = time;
});