#hltv-scorebot

##Commands

- `scorebot.connect(url, matchid, events, displayText)`
    - `url` should be `'http://scorebot.hltv.org:10022'` for almost all cases.
    - `matchid` can be found on every HLTV page with ScoreBot currently enabled.
    - `events` should be an EventEmitter object.
    - `displayText` should be either true or false. By enabling displayText, all the events of the match will be logged to the console, like the real HLTV ScoreBot.
- `scorebot.on(event, callback)`

##Classes

- Player
    - id
    - side
    - name
    - kills
    - deaths
    - death
    - element
- Log
    - id
    - round
    - roundTime
    - type
    - side
    - html
    - text
    - attr

##Events

- mapChanged
    - mapAttr
        - map
- roundOver
    - winner
    - scores
        - t
        - ct
- roundStarted
- kill
    - killAttr
        - headshot
        - weapon
        - agressor
        - victim
- bombPlanted
    - bombInteractionAttr
        - player
- bomdDefused
    - bombInteractionAttr
        - player
- playerLeft
    - connectionAttr
        - player
- playerUpdate
    - Array<Player>[]
- scoreUpdate
    - tScore
    - ctScore