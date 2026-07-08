# 🖥️ Backend

> Express server running on port 5000. Handles REST API and WebSocket connections.

← Back to [[MOC - DevDock]] | Part of [[System Architecture]]

---

## Stack
- [[Express]] — HTTP server and routing
- [[Dockerode]] — talks to Docker Engine
- [[Socket.io]] — WebSocket server for live logs

---

## File Structure
```
server/
├── index.js       ← entire backend lives here
├── Dockerfile     ← Node.js 20 Alpine
└── package.json
```

---

## index.js Breakdown

### Setup
```js
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {...} });

// Cross-platform Docker socket
const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : { socketPath: "/var/run/docker.sock" }
);
```

### REST Routes
See → [[REST Endpoints]]

### WebSocket Handler
See → [[WebSocket Events]]

---

## Cross-Platform Support
DevDock auto-detects Windows vs Linux/Mac and uses the correct Docker socket path — no manual config needed.

---

## Key Dependencies
```json
"express": "^5.1.0"
"dockerode": "^4.0.9"
"socket.io": "^4.8.3"
"cors": "^2.8.5"
```

---

#devdock #backend #express #nodejs
