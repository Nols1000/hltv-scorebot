# Helper

## How to use it

Record the scorebot traffic and save it to the filename.
Each event is logged in a new line in JSON-Format. 
**!!!Dont change it manualy.!!!**
```
node scorebot_recorder [url] [listid] [filename]
```


Replay the traffic at your machine at the port from your record-file.
```
node scorebot_server [port] [filename]
```

## Share your records

1. Create a new Repository and upload you're logs.
2. Select the [Branch logs](https://github.com/Nols1000/hltv-scorebot/tree/logs) in my Repository [hltv-scorebot](https://github.com/Nols1000/hltv-scorebot).
3. [Make a Pull Request](https://github.com/Nols1000/hltv-scorebot/pull/new/logs) to merge you're Repository with your logs in it.