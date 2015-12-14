# HLTV Scorebot Protocol

## Description

## Socket.IO

The Scorebot uses [Socket.IO](http://socket.io/) to connect to it's clients. It sends data in [JSON-Format](http://json.org/).

## Calls

### readyForMatch [listid]

The Scorebot needs the listid to provide the data.
You have to emit it with the name readyForMatch.

```javascript
socket.emit('readyForMatch', [listid])
```

## Events

### Register Event Listener
To get the data you have to register events. If the Scorebot emits a event with the name ```[eventName]``` the ```[callbackFunction]``` gets triggered. The ```[callbackFunction]``` has 1 argument with data in it. (See in the list below.)

```javascript
socket.on([eventName], [callbackFunction]);
```

### Event: log

**!!! BE AWARE LOG PROVIDES ITS DATA AS STRING NOT OBJECT! YOU HAVE TO PARSE IT !!!**

```javascript
socket.on('log', function() {
  arguments[0] = JSON.parse(arguments[0]);
});
```

#### Kill
```json
{
	"log": [{
		"Kill": {
			"killerName": "Happy",
			"killerSide": "TERRORIST",
			"victimName": "JW",
			"victimSide": "CT",
			"weapon": "mac10",
			"headShot": false
		}
	}]
}

{
	"log": [{
		"Suicide": {
			"playerName": "kioShiMa",
			"side": "TERRORIST"
		}
	}]
}
```


#### Bomb
```json
{
	"log": [{
		"BombPlanted": {
			"playerName": "NBK-",
			"ctPlayers": 3,
			"tPlayers": 5
		}
	}]
}

{
	"log":[{
		"RoundEnd": {
			"counterTerroristScore": 8,
			"terroristScore": 14,
			"winner": "CT",
			"winType": "Bomb_Defused"
		}
		{
			"BombDefused": {
				"playerName": "KRIMZ"
			}
		}
	}]
}
```


#### Round
```json
{
	"log":[{
		"RoundStart":{
		
		}
	}]
}

{
	"log":[{
		"RoundEnd":{
			"counterTerroristScore": 4,
			"terroristScore": 8,
			"winner": "TERRORIST",
			"winType": "Target_Bombed"
		}
	}]
}
```


#### Player
```json
{
	"log":[{
		"PlayerJoin":{
			"playerName": "KJB"
		}
	}]
}

{
	"log":[{
		"PlayerQuit": {
			"playerName": "Mod",
			"playerSide": "SPECTATOR"
		}
	}]
}
```


#### Map
```json
{
	"log":[{
		"MapChange":{
			"mapName":"de_cache"
		}
	}]
}

{
	"log":[{
		"MatchStarted": {
			"map": "de_cache"
		}
	}]
}
```


### Event: scoreboard
```json
{
	"TERRORIST": [{
		"steamId": "1:0:35692928",
		"dbId": 7528,
		"name": "KRIMZ",
		"score": 9,
		"deaths": 14,
		"assists": 2,
		"alive": true,
		"rating": 0.62,
		"money": 0
	},
	{
		"steamId": "1:0:35644236",
		"dbId": 3849,
		"name": "JW",
		"score": 8,
		"deaths": 16,
		"assists": 1,
		"alive": false,
		"rating": 0.54,
		"money": 100
	},
	{
		"steamId": "1:0:4709591",
		"dbId": 41,
		"name": "pronax",
		"score": 7,
		"deaths": 16,
		"assists": 3,
		"alive": false,
		"rating": 0.46,
		"money": 100
	},
	{
		"steamId": "1:1:15541177",
		"dbId": 3055,
		"name": "flusha",
		"score": 6,
		"deaths": 15,
		"assists": 1,
		"alive": false,
		"rating": 0.42,
		"money": 300
	},
	{
		"steamId": "1:1:14180732",
		"dbId": 885,
		"name": "olofmeister",
		"score": 3,
		"deaths": 16,
		"assists": 0,
		"alive": false,
		"rating": 0.2,
		"money": 50
	}],
	"CT": [{
		"steamId": "1:1:222422",
		"dbId": 7168,
		"name": "NBK-",
		"score": 19,
		"deaths": 6,
		"assists": 2,
		"alive": true,
		"rating": 1.8,
		"money": 2250
	},
	{
		"steamId": "1:0:8987812",
		"dbId": 7429,
		"name": "Happy",
		"score": 18,
		"deaths": 7,
		"assists": 4,
		"alive": false,
		"rating": 1.71,
		"money": 3300
	},
	{
		"steamId": "1:1:14739219",
		"dbId": 7322,
		"name": "apEX",
		"score": 16,
		"deaths": 8,
		"assists": 4,
		"alive": true,
		"rating": 1.53,
		"money": 4800
	},
	{
		"steamId": "1:1:20258583",
		"dbId": 4959,
		"name": "kioShiMa",
		"score": 14,
		"deaths": 4,
		"assists": 1,
		"alive": true,
		"rating": 1.41,
		"money": 0
	},
	{
		"steamId": "1:0:32320034",
		"dbId": 7167,
		"name": "kennyS",
		"score": 10,
		"deaths": 8,
		"assists": 1,
		"alive": false,
		"rating": 0.96,
		"money": 1000
	}],
	"ctMatchHistory": {
		"firstHalf": [{
			"type": "Terrorists_Win",
			"roundOrdinal": 1
		},
		{
			"type": "Target_Bombed",
			"roundOrdinal": 2
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 3
		},
		{
			"type": "Target_Bombed",
			"roundOrdinal": 4
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 5
		},
		{
			"type": "lost",
			"roundOrdinal": 6
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 7
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 8
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 9
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 10
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 11
		},
		{
			"type": "Target_Bombed",
			"roundOrdinal": 12
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 13
		},
		{
			"type": "lost",
			"roundOrdinal": 14
		},
		{
			"type": "Terrorists_Win",
			"roundOrdinal": 15
		}],
		"secondHalf": [{
			"type": "CTs_Win",
			"roundOrdinal": 16
		},
		{
			"type": "CTs_Win",
			"roundOrdinal": 17
		}]
	},
	"terroristMatchHistory": {
		"firstHalf": [{
			"type": "lost",
			"roundOrdinal": 1
		},
		{
			"type": "lost",
			"roundOrdinal": 2
		},
		{
			"type": "lost",
			"roundOrdinal": 3
		},
		{
			"type": "lost",
			"roundOrdinal": 4
		},
		{
			"type": "lost",
			"roundOrdinal": 5
		},
		{
			"type": "Target_Saved",
			"roundOrdinal": 6
		},
		{
			"type": "lost",
			"roundOrdinal": 7
		},
		{
			"type": "lost",
			"roundOrdinal": 8
		},
		{
			"type": "lost",
			"roundOrdinal": 9
		},
		{
			"type": "lost",
			"roundOrdinal": 10
		},
		{
			"type": "lost",
			"roundOrdinal": 11
		},
		{
			"type": "lost",
			"roundOrdinal": 12
		},
		{
			"type": "lost",
			"roundOrdinal": 13
		},
		{
			"type": "CTs_Win",
			"roundOrdinal": 14
		},
		{
			"type": "lost",
			"roundOrdinal": 15
		}],
		"secondHalf": [{
			"type": "lost",
			"roundOrdinal": 16
		},
		{
			"type": "lost",
			"roundOrdinal": 17
		}]
	},
	"bombPlanted": false,
	"mapName": "de_cache",
	"terroristTeamName": "fnatic",
	"ctTeamName": "EnVyUs",
	"currentRound": 18,
	"counterTerroristScore": 15,
	"terroristScore": 2,
	"ctTeamId": 5991,
	"tTeamId": 4991
}
```



### Event: score
**This Event provides an Object**
```json
{
	"mapScores": {
		"1": {
			"firstHalf": {
				"ctTeamDbId": 5991,
				"ctScore": 7,
				"tTeamDbId": 4991,
				"tScore": 8
			},
			"secondHalf": {
				"ctTeamDbId": 4991,
				"ctScore": 8,
				"tTeamDbId": 5991,
				"tScore": 2
			},
			"overtime": {
				"ctTeamDbId": -1,
				"ctScore": 0,
				"tTeamDbId": -1,
				"tScore": 0
			},
			"scores": {
				"4991": 16,
				"5991": 9
			},
			"map": "de_mirage"
		},
		"2": {
			"firstHalf": {
				"ctTeamDbId": 5991,
				"ctScore": 9,
				"tTeamDbId": 4991,
				"tScore": 6
			},
			"secondHalf": {
				"ctTeamDbId": 4991,
				"ctScore": 3,
				"tTeamDbId": 5991,
				"tScore": 7
			},
			"overtime": {
				"ctTeamDbId": -1,
				"ctScore": 0,
				"tTeamDbId": -1,
				"tScore": 0
			},
			"scores": {
				"4991": 9,
				"5991": 16
			},
			"map": "de_cobblestone"
		},
		"3": {
			"firstHalf": {
				"ctTeamDbId": 4991,
				"ctScore": 2,
				"tTeamDbId": 5991,
				"tScore": 13
			},
			"secondHalf": {
				"ctTeamDbId": 5991,
				"ctScore": 3,
				"tTeamDbId": 4991,
				"tScore": 0
			},
			"overtime": {
				"ctTeamDbId": -1,
				"ctScore": 0,
				"tTeamDbId": -1,
				"tScore": 0
			},
			"scores": {
				"4991": 2,
				"5991": 16
			},
			"map": "de_cache"
		}
	},
	"currentMap": {
		"firstHalf": {
			"ctTeamDbId": 4991,
			"ctScore": 2,
			"tTeamDbId": 5991,
			"tScore": 13
		},
		"secondHalf": {
			"ctTeamDbId": 5991,
			"ctScore": 3,
			"tTeamDbId": 4991,
			"tScore": 0
		},
		"overtime": {
			"ctTeamDbId": -1,
			"ctScore": 0,
			"tTeamDbId": -1,
			"tScore": 0
		},
		"live": false,
		"liveLog": {
			"": false,
			"PlayersRequirement": true,
			"FiveKillsWhenEnemyElliminatedRequirement": true,
			"NotKnifeRoundRequirement": true,
			"BombInPlayRequirement": true,
			"RoundOneMaxPurchaseRequirement": true,
			"MatchStartRequirement": true,
			"MapNameRequirement": true,
			"FirstRoundOverRequirement": true
		},
		"map": "de_cache",
		"currentCTTeam": 5991,
		"currentTTeam": 4991,
		"currentCtScore": 16,
		"currentTScore": 2,
		"mapOrdinal": 4
	},
	"listId": 2298971,
	"wins": {
		"4991": 1,
		"5991": 2
	}
}

```

## Implementations

- [[Node] HLTV-Scorebot](https://github.com/Nols1000/hltv-scorebot)
- [Browser] HLTV-Scorebot (coming soon)

