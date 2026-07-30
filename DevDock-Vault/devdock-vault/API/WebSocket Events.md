# ⚡ WebSocket Events

> Socket.io events used for live log streaming in DevDock.

← Back to [[MOC - DevDock]] | Powered by [[Socket.io]] | Feature: [[Live Log Streaming]]

---

## Connection
```js
// Client connects to:
const socket = io("http://localhost:5000");
```

---

## Events Reference

### Client → Server

#### `subscribe:logs`
Start streaming logs for a container.
```js
socket.emit("subscribe:logs", containerId);
// containerId: string (Docker container ID)
```

#### `unsubscribe:logs`
Stop streaming and destroy the log stream.
```js
socket.emit("unsubscribe:logs");
// no payload needed
```

---

### Server → Client

#### `log:line`
A new log line received from Docker.
```js
socket.on("log:line", ({ type, text }) => {
  // type: "stdout" | "stderr"
  // text: string (the log line content)
});
```

#### `log:end`
The container stopped — log stream ended naturally.
```js
socket.on("log:end", () => {
  // update status to "ended"
});
```

#### `log:error`
An error occurred in the stream.
```js
socket.on("log:error", (message) => {
  // message: string (error description)
});
```

---

## Lifecycle
```
connect → subscribe:logs → [log:line × N] → log:end
                                          → log:error
                        → unsubscribe:logs (user closes modal)
disconnect (browser closes)
```

---

## Stream Cleanup
Server tracks all active streams in a Map:
```js
const activeStreams = new Map(); // socketId → Docker stream
```
Streams are destroyed on: disconnect, unsubscribe, or new subscribe.

---

#devdock #api #websockets #socketio #events
