# Browser Libary

## Getting Started

This Libary requires EventEmitter by Olical (https://github.com/Olical/EventEmitter) and socket.io-client by the socket.io-team (https://github.com/socketio/socket.io-client). Both requirements are in the Repository (https://github.com/Nols1000/hltv-scorebot/tree/master/browser/lib).

```
<script src="lib/EventEmitter.min.js" type="text/javascript">
</script>
<script src="lib/socket.io.js" type="text/javascript">
</script>
```

Embedd the Libary after its requirements.

```
<script src="Scorebot.js" type="text/javascript">
</script>
```

Then you can add your scripts using the Libary.

```
<script src="example.js" type="text/javascript">
</script>
```

example.js
```
var bot = new Scorebot();

bot.connect({ 'matchid': 343324 });

bot.on('kill', function(killAttr) {
    console.log(killAttr.agressor.name, 'killed', killAttr.victim.name, 'with', killAttr.weapon, killAttr.headshot ? '(headshot)' : '');
});

bot.on('mapChanged', function(mapAttr) {
    console.log('Map changed to', mapAttr.map, '.');
});

bot.on('restarted', function() {
    console.log('Server was restarted.');
});

bot.on('roundOver', function(winner) {
    console.log(winner.side, 'wins the round.');
});

bot.on('roundStarted', function() {
    console.log('Round started.');
});

bot.on('bombPlanted', function(bombInteractionAttr) {
    console.log(bombInteractionAttr.player.name, 'planted the bomb.');
});

bot.on('bombDefused', function(bombInteractionAttr) {
    console.log(bombInteractionAttr.player.name, 'defused the bomb');
});

bot.on('nameChange', function(nameAttr) {
    console.log(nameAttr.old, 'is now', nameAttr.new);
});

bot.on('playerLeft', function(connectionAttr) {
    console.log(connectionAttr.player.name, 'left the game.');
});

bot.on('score', function(score) {
    console.log('New Score: T', score.t, '-', score.ct, 'CT');
});

bot.on('scoreboardUpdated', function(player) {
    console.log(JSON.stringify(player));
});
```

## Documentation

### Player
```
new Player(Integer id, String side, String name, Integer kills, Integer deaths, Boolean death);
```

### Log
```
new Log(Integer id, Integer round, Integer roundTime, String type, String side, String html, String text, String attr);
```

### Scorebot
```
new Scorebot();
```

#### connect
```
bot.connect(options)
```

Connect to a Scorebot. 
``` options ``` is required.

```
var bot = new Scorebot();

var options = {
    port: 10022,
    url: 'http://scorebot.hltv.org',
    matchid: 33423
};

bot.connect(options);
```

#### on
Register EventListener.
(eventName, callbackFunction)
```
bot.on('event', function(arg0, arg1, ...) {

});
```

#### emit
Fire a Event.
(eventName, arguments ...)
```
bot.emit('event', arg0, arg1, ...);
```

#### getPlayer
Get a PlayerObject by Name. 
Returns ``` null ``` if thers is no Player with this name.
(playerName)

```
var player = bot.getPlayer(name);
```

#### getPlayerIndexOf
Get the index of a Player by Name.
Returns ``` -1 ``` if there is no Player with this name.
Returns ``` index + CT-Player Amount ``` for T-Players.

```
var index = bot.getPlayerIndexOf(name);

if(index >= player.ct.lenght) {
    var p = player.t[index - player.ct.lenght];
}else {
    var p = player.ct[index];
}
```