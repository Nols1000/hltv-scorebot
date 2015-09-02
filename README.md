# HLTV Scorebot

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/hltv-scorebot)

## Getting started

**Get the module with the npm:**
```
npm install hltv-scorebot
```

**Install manually:**

1. Download the latest build of the module at [Releases](https://github.com/Nols1000/hltv-scorebot/releases).
2. Extract the package and copy it to your projects `node_modules`-folder
3. Rename the module-folder (e.g. `hltv-scorebot-0.1.4`) to `hltv-scorebot`
4. Execute your console in the module-folder (`hltv-scorebot`)
5. Execute `npm install` (This should download and install all dependencies [currently only `socket.io-client@1.3.5`. Check out `package.json`]) 

**Using HLTV-Scorebot:**
```javascript
var Scorebot = require('hltv-scorebot');

var sb = new Scorebot();
    sb.connect('http://scorebot.hltv.org', 10023, 36747)  // Match 36747 was CLG vs eBettle at ESL One Cologne 2015
                                                          // Check out the helper-branch for example data
    sb.on('kill', function(killer, victim, weapon, headshot, assister) {
        
        var killerName = killer.name;
        
        // Checking if assister exists
        if(assister)
            killerName = killer.name + " and " + assister.name;  
        
        console.log(killer.name, 'killed', vicitim.name, 'with', weapon, headshot ? 'headshot' : '');
    });
```

## Constants

- Team
  - `TERRORIST = 0`
  - `COUNTERTERRORIST = 1`

## Methods

- `connect(url, port, matchid)`
    - `url` the ip of the scorebot server (def. `http://scorebot.hltv.org`).
    - `port` the port of the scorebot server (def. `10023`).
    - `matchid` identifier for your wanted match. [andrewda](https://github.com/andrewda) made a module to get the matchid <https://github.com/andrewda/hltv-live-games>
- `on(event, callback)`
    - `event`
       - `time`
          - `callback: function(time) [int]`
          - updates game clock every second 
          - freeze timer is **experimental**
       - `score`
          - `callback: function(tscore, ctscore) [int, int]`
          - updates score every round after `roundend`
       - `player`
          - `callback: function(playermanager) [PlayerManager]`
          - updates playermanager every time a player is updated
       - `kill`
          - `callback: function(killer, victim, weapon, headshot, assister) [Player, Player, String, boolean, Player]`
          - triggers callback when `killer` kills `victim` with `weapon`
          - assister is **optional**
       - `assist`
          - `callback: function(assister, victim) [Player, Player]`
          - triggers callback when `assister` assists in a kill of `victim`
       - `bombplanted`
          - `callback: function(planter) [Player]`
          - triggers callback when bomb is planted
       - `bombdefused`
          - `callback: function(defuser) [Player]`
          - triggers callback when bomb is defused
       - `roundstart`
          - `callback: function()`
          - triggers callback when round starts
       - `roundend`
          - `callback: function(winner, tscore, ctscore) [int, int, int]`
          - triggers callback when round ends
          - `winner` 0 | 1 (0 - T | 1 - CT)
       - `playerjoin`
          - `callback: function(player) [Player]`
          - triggers callback when a player joins the server
       - `playerquit`
          - `callback: function(player) [Player]`
          - triggers callback when a player leaves the server
       - `mapchange`
          - `callback: function(map) [String]`
          - triggers callback when the server changes map
       - `restart`
          - `callback: function()`
          - triggers callback when server restarts

## Classes

- `Scorebot.Player`
  - `id [int]`
  - `steamID [String]`
  - `name [String]`
  - `team [int]`
  - `kills [int] `
  - `assists [int]`
  - `deaths [int]`
  - `alive [boolean]`
- `Scorebot.HLTVPlayer`
  - `name [String]`
  - `team [int]`
  - `kills [int] `
  - `deaths [int]`
  - `alive [boolean]`
- `Scorebot.KPlayer`
  - `id [int]`
  - `steamID [String]`
  - `name [String]`
  - `team [int]`
- `Scorebot.APlayer`
  - `id [int]`
  - `name [String]`
  - `team [int]`
  - NODE: Assist will be counted when merge with `Player`
- `Scorebot.PlayerManager`
  - `TERRORIST [int]`
    - 0
  - `COUNTERTERRORIST [int]`
    - 1
  - `playerList[team][index] [Array]`
    - 2 dimensional array
    - stores all players
  - `set(team, player) [function]`
    - append/update player `player` in team `team`
  - `get(team, index) [function]`
    - returns the player in team `team` at `index`
  - `getIndex(name) [function]`
    - returns object with team and index of the player with the name `name`
    - return: `{ 'team': 0, 'index': 0 }`
    - returns `{ 'team': -1, 'index': -1 }` if there is no player with the name `name`
  - `getByName(name) [function]`
    - returns player with the name `name`
  - `getByNameAsync(name, callback) [function]`
    - calls the callback with player with the name `name` as argument
    - callback: `function(error, player)`
  - `del(name) [function]`
    - deletes player with the name `name`


## Known Bugs

- Assists counter wont reset after warm-up

## Examples

To be done 

**(Try the examples Folder at the [hltv-scorebot repository](https://github.com/Nols1000/hltv-scorebot))**

---

I'm sorry for my poor English. If you have some problems understanding the module, the README or my documentation please mail me (nilsmargotti [at] gmail [dot] com).

Every Feedback is welcome.

*Nils 'Nols1000' Margotti*
