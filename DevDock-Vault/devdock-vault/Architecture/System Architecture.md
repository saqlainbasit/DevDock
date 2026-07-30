# 🏗️ System Architecture

> How all pieces of DevDock connect together.

← Back to [[MOC - DevDock]]

---

## Overview

```
Browser (localhost:3000)
        ↓
   [Nginx Server]          ← serves React build
        ↓
   [React Frontend]        ← [[Frontend]]
        ↓  ↑
   HTTP (axios)     WebSocket (socket.io)
        ↓  ↑
   [Express Backend]       ← [[Backend]]
        ↓
   [Dockerode]             ← [[Dockerode]]
        ↓
   [Docker Engine]         ← /var/run/docker.sock
        ↓
   [Your Containers]
```

---

## Two Servers Running

| Server | Port | Role |
|--------|------|------|
| Nginx (client) | 3000 | Serves React SPA |
| Express (server) | 5000 | API + WebSockets |

---

## Communication Types

### REST (HTTP)
Used for all container actions — fetch, start, stop, restart, remove.
See → [[REST Endpoints]]

### WebSockets
Used only for live log streaming — keeps connection open and pushes data.
See → [[WebSocket Events]]

---

## Data Flow Example — Clicking "Stop"

```
User clicks Stop button
→ React sends POST /containers/:id/stop
→ Express receives request
→ Dockerode calls Docker Engine
→ Docker stops the container
→ Express returns { message: "Stopped" }
→ React shows toast notification
→ React re-fetches containers after 600ms
```

---

## Deployment
Both services run as Docker containers via [[Docker Compose]].

---

#devdock #architecture #system
