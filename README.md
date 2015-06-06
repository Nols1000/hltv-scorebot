#hltv-scorebot

##Installation

    npm install hltv-scorebot

##Commands

- scorebot.connect(url, matchid, events)
- on(event, callback)
- [Player] getPlayerByName(name)

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