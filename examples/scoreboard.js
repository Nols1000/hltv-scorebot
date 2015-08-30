var Scorebot = require('../Scorebot.js');

var score = {};
	score.t = "0";
	score.ct = "0";

var sb = new Scorebot();

sb.connect(process.argv[2], process.argv[3], process.argv[4]);

sb.on('player', function(pm) {
	
	print_table(pm.playerList);
});

sb.on('score', function(t, ct) {
	
	score.t = t+"";
	score.ct = ct+"";
});

function print_table(playerList) {
	
	var c = process.stdout.columns;
	
	var c_name 		= [];
	var c_kills 	= [];
	var c_assists	= [];
	var c_deaths 	= [];
	var c_alive		= [];
	
	playerList[0].forEach(function(player, index, array) {
		
		c_name[c_name.length] 		= player.name;
		c_kills[c_kills.length] 		= player.kills + "";
		c_assists[c_assists.length] 	= player.assists + "";
		c_deaths[c_deaths.length]		= player.deaths + "";
		c_alive[c_alive.length] 		= player.alive ? " " : "X";
	});
	
	playerList[1].forEach(function(player, index, array) {
		
		c_name[c_name.length] 		= player.name;
		c_kills[c_kills.length] 		= player.kills + "";
		c_assists[c_assists.length] 	= player.assists + "";
		c_deaths[c_deaths.length]		= player.deaths + "";
		c_alive[c_alive.length] 		= player.alive ? " " : "X";
	});
	
	var c_name_size 	= largest(c_name);
	var c_kills_size 	= largest(c_kills);
	var c_assists_size 	= largest(c_assists);
	var c_deaths_size 	= largest(c_deaths);
	var c_alive_size 	= 3;
	var c_a_size = (c_alive_size + c_assists_size + c_deaths_size + c_kills_size + c_name_size + 6);
	
	if(c_a_size > c) {
		c_name_size = c - (c_alive_size + c_assists_size + c_deaths_size + c_kills_size + 6);
		c_a_size = c;
	}
	
	r_header = [];
	r_scoreheader = [];
	r_player = [];
	r_footer = "";
	
	var name 	= setlength("Name", c_name_size -2);
	var kills 	= setlength("K", c_kills_size - 2);
	var assists = setlength("A", c_assists_size - 2);
	var deaths 	= setlength("D", c_deaths_size - 2);
	var alive 	= setlength("L", c_alive_size - 2);
		
	r_header[0] = "+"; 
	
	for(var i = 0; i < (c_a_size - 2);i++) {
		
		r_header[0] = r_header[0] + '-';
	}
	
	r_scoreheader[0] = "+- "+setlength("T", 2)+" "+setlength(score.t, 2)+" ";
	
	for(var i = 0; i < (c_a_size - 10);i++) {
		
		r_scoreheader[0] = r_scoreheader[0] + '-';
	}
	
	r_scoreheader[0] = r_scoreheader[0] + '+';
	
	r_scoreheader[1] = "+- "+setlength("CT", 2)+" "+setlength(score.ct, 2)+" ";
	
	for(var i = 0; i < (c_a_size - 10);i++) {
		
		r_scoreheader[1] = r_scoreheader[1] + '-';
	}
	
	r_scoreheader[1] = r_scoreheader[1] + '+';
	
	r_header[0] = r_header[0] + "+";
	r_header[1] = "| "+ name +" | "+ kills +" | "+ assists +" | "+ deaths +" | "+ alive +" |"; 
	r_header[2] = r_header[0];
	r_footer    = r_header[0];
	
	c_name.forEach(function(str, index, array) {
		
		var name 	= setlength(c_name[index], c_name_size -2);
		var kills 	= setlength(c_kills[index], c_kills_size - 2);
		var assists = setlength(c_assists[index], c_assists_size - 2);
		var deaths 	= setlength(c_deaths[index], c_deaths_size - 2);
		var alive 	= setlength(c_alive[index], c_alive_size - 2);
		
		r_player[r_player.length] = "| "+ name +" | "+ kills +" | "+ assists +" | "+ deaths +" | "+ alive +" |"; 
	});
	
	r_tplayer = r_player.slice(0,5);
	r_ctplayer = r_player.splice(5,10);
	
	clear();
	
	console.log(r_header[0]);
	console.log(r_header[1]);
	console.log(r_header[2]);
	
	console.log(r_scoreheader[0]);
	
	r_tplayer.forEach(function(row) {
		
		console.log(row);
	});
	
	console.log(r_scoreheader[1]);
	
	r_ctplayer.forEach(function(row) {
		
		console.log(row);
	});
	
	console.log(r_footer);
}

function largest(array) {
	
	var length = 0;
	
	array.forEach(function(str, index, array) {
		
		if(length < str.length) 
			length = str.length;
	});
	
	return length + 2;
}

function setlength(str, l) {
	
	while(str.length < l) {
		
		str = str+" ";
	}
	
	while(str.length > l) {
		
		str = str.slice(0,(str.length-1));
	}
	
	return str;
}

function clear() {
  process.stdout.write('\u001B[2J\u001B[0;0f');
}