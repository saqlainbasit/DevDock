# 🐳 Dockerode

> Node.js library that wraps the Docker Engine REST API. The bridge between DevDock and Docker.

← Back to [[MOC - DevDock]] | Used in [[Backend]]

---

## Version
Dockerode 4.0.9

---

## Why Dockerode?
- Docker has a REST API over a Unix socket
- Dockerode wraps it in clean async/await Node.js calls
- No need to manually craft HTTP requests to the socket

---

## Connection Setup
```js
const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }  // Windows
    : { socketPath: "/var/run/docker.sock" }     // Linux/Mac
);
```
Auto-detects platform — works on Windows, Mac, and Linux. ✅

---

## Key Methods Used

| Method | What it does |
|--------|-------------|
| `docker.listContainers({ all: true })` | Get all containers |
| `docker.getContainer(id).start()` | Start a container |
| `docker.getContainer(id).stop()` | Stop a container |
| `docker.getContainer(id).restart()` | Restart a container |
| `docker.getContainer(id).remove({ force: true })` | Remove a container |
| `docker.getContainer(id).logs({...})` | Get/stream logs |

---

## Log Streaming
```js
const stream = await container.logs({
  follow: true,     // keep stream open
  stdout: true,
  stderr: true,
  tail: 100,        // last 100 lines first
  timestamps: true,
});

// Docker muxes stdout+stderr — demux it:
container.modem.demuxStream(stream, stdoutWriter, stderrWriter);
```

---

## Connected To
- [[Backend]] — where Dockerode is instantiated
- [[REST Endpoints]] — every route uses Dockerode
- [[Live Log Streaming]] — uses Dockerode log streaming

---

#devdock #tech #dockerode #docker #nodejs
