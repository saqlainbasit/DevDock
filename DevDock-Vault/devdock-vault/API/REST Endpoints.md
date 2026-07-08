# 🔗 REST Endpoints

> All HTTP API routes exposed by the DevDock Express server.

← Back to [[MOC - DevDock]] | Handled by [[Express]] via [[Dockerode]] | Called from [[Frontend]]

---

## Base URL
```
http://localhost:5000
```

---

## Endpoints

### GET /containers
Returns all containers (running + stopped).
```js
// Response
[
  {
    Id: "abc123...",
    Names: ["/my-container"],
    Image: "nginx:latest",
    State: "running",
    Status: "Up 2 hours",
    Ports: [{ PublicPort: 8080, PrivatePort: 80 }]
  },
  ...
]
```

---

### POST /containers/:id/start
Starts a stopped container.
```js
// Response
{ message: "Container started" }
```

---

### POST /containers/:id/stop
Stops a running container.
```js
// Response
{ message: "Container stopped" }
```

---

### POST /containers/:id/restart
Restarts a container.
```js
// Response
{ message: "Container restarted" }
```

---

### DELETE /containers/:id/remove
Force removes a container (running or stopped).
```js
// Response
{ message: "Container removed" }
```

---

### GET /containers/:id/logs
One-shot log fetch (last 100 lines). Used as fallback.
```js
// Response: plain text log output
```

---

## Error Response Format
All errors return:
```js
{ error: "error message here" }
// HTTP status 500
```

---

## Real-time Logs
Not a REST endpoint — uses WebSockets.
See → [[WebSocket Events]]

---

#devdock #api #rest #endpoints #express
