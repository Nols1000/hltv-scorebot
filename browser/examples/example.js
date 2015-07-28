var bot = new Scorebot();

function start(matchid) {
	bot.connect({
		'matchid': matchid
	});
}

bot.on(score, function(score) {
	
	document.getElementById('tscore').innerHTML = score.t;
	document.getElementById('ctscore').innerHTML = score.ct;
});