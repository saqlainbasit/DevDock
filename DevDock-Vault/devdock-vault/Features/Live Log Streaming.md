# 📋 Live Log Streaming

> Real-time container logs streamed to the browser via WebSockets.

← Back to [[MOC - DevDock]] | Uses [[Socket.io]] | See [[WebSocket Events]]

---

## How It Works

```
User clicks "Logs" button
→ LogModal opens
→ React connects to Socket.io server
→ Emits subscribe:logs with containerId
→ Server opens Docker log stream via Dockerode
→ Server demuxes stdout/stderr
→ Each line emitted as log:line event
→ React appends line to UI in real-time
→ User closes modal → unsubscribe:logs emitted
→ Server destroys stream
```

---

## Key Features
- **Live** — logs appear as they happen
- **Last 100 lines** — sent immediately on connect
- **stdout vs stderr** — green vs red coloring
- **Auto-scroll** — follows latest log line
- **Toggle auto-scroll** — click to pause/resume
- **Clear** — wipe current log view
- **Line counter** — shows total lines received
- **Stream status** — connecting / live / ended / error

---

## Server Side — Demuxing
Docker multiplexes stdout and stderr into one stream.
Dockerode demuxes it:
```js
container.modem.demuxStream(
  stream,
  { write: (chunk) => socket.emit("log:line", { type: "stdout", text: chunk.toString() }) },
  { write: (chunk) => socket.emit("log:line", { type: "stderr", text: chunk.toString() }) }
);
```

---

## Stream Cleanup
Every socket has its stream tracked in a Map.
On disconnect or unsubscribe — stream is destroyed immediately.
No memory leaks. ✅

---

## Color Coding
| Type | Color |
|------|-------|
| stdout | `#86efac` (green) |
| stderr | `#f87171` (red) |

---

#devdock #feature #logs #websockets #realtime
