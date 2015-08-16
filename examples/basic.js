// This example connects to an HLTV match and displays a message after each kill and after each round.

var scorebot = require('hltv-scorebot');
var EventEmitter = require('events').EventEmitter;
var em = new EventEmitter();

var currentScore = 'PLEASE WAIT FOR THE SCORE TO UPDATE!';

em.on('connect',  function () {
	
	console.log('connected');
})

// Connect to the scorebot                           \/ Replace with your match's matchid
scorebot.connect('http://scorebot.hltv.org:10022', 366435, em, false);

scorebot.on('kill', function(data) {
	// Log all kills to console
	console.log(data.agressor, 'killed', data.victim, 'by', data.weapon, data.headshot ?  "(headshot)" : "");
});

scorebot.on('scoreUpdate', function(t, ct) {
    // Update the score
    currentScore = 'CT: ' + ct + ' | ' + 'T: ' + t;
});

scorebot.on('roundOver', function(data, scores) {
	// Alert score and round winner to console.
	console.log('The ' + data.side + '\'s won the round!');
	console.log(currentScore);
});
