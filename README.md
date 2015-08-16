#hltv-scorebot

##Methods

- `connect(url, matchid, events, debug)`
    - `url` should be `'http://scorebot.hltv.org:10022'` for almost all cases.
    - `matchid` can be found on every HLTV page with ScoreBot currently enabled.
    - `events` should be an EventEmitter object.
    - `debug` should be either true or false. By enabling it, all the events of the match will be logged to the console, like the real HLTV Scorebot.
- `on(event, callback)`

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
    - knifeRound
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
- bombDefused
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
- nameChange
    - nameAttr
        - old
        - new
- restart
