// This example connects to an HLTV match and displays a message after each kill and after each round.

var scorebot = require('hltv-scorebot');
var EventEmitter = require('events').EventEmitter;
var em = new EventEmitter();

var currentScore = 'PLEASE WAIT FOR SCORE UPDATE!';

scorebot.connect('http://scorebot.hltv.org:10022', 364856, em, false);

scorebot.on('kill', function(data) {
	console.log(data.agressor, 'killed', data.victim, 'with their', data.weapon, data.headshot ?  "(headshot)" : "");
});

scorebot.on('scoreUpdate', function(t, ct) {
    currentScore = 'CT:', ct, '|', 'T:', t;
});

scorebot.on('roundOver', function(data, scores) {
	console.log('The', data.side + '\'s won the round!');
	console.log(currentScore);
});