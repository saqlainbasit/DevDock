# 🔌 Socket.io

> Real-time bidirectional communication library. Used for live log streaming in DevDock.

← Back to [[MOC - DevDock]] | Used in [[Backend]] and [[Frontend]] | See [[Live Log Streaming]]

---

## Version
Socket.io 4.8.3 (server + client)

---

## Why Socket.io?
- HTTP polling can't push data — WebSockets can
- Logs need to stream live as they happen
- Socket.io handles reconnection automatically

---

## Server Setup
```js
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
```

---

## Client Setup
```js
const socket = io("http://localhost:5000");
socket.on("connect", () => {
  socket.emit("subscribe:logs", containerId);
});
```

---

## Event Flow
```
Client                    Server
  |                          |
  |-- subscribe:logs ------->|
  |                          |-- opens Docker stream
  |<-------- log:line -------|
  |<-------- log:line -------|
  |<-------- log:line -------|
  |                          |
  |-- unsubscribe:logs ----->|
  |                          |-- destroys stream
```

Full event reference → [[WebSocket Events]]

---

## Stream Tracking
```js
const activeStreams = new Map(); // socketId → stream
// Destroyed on: unsubscribe, disconnect, new subscribe
```

---

## Connected To
- [[Live Log Streaming]] — the feature it powers
- [[WebSocket Events]] — full event reference
- [[Backend]] — server side
- [[Frontend]] — client side (LogModal)

---

#devdock #tech #socketio #websockets #realtime
