# 🐳 DevDock

> A personal Docker environment manager — control your containers visually, without touching the CLI.

![DevDock Dashboard](https://img.shields.io/badge/status-active-22c55e?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node.js%20%2B%20Docker-3b82f6?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-a855f7?style=flat-square)

---

## ✨ Features

- **Container Dashboard** — view all running and stopped containers with live status
- **One-Click Actions** — start, stop, restart, and remove containers instantly
- **Live Log Streaming** — real-time logs per container via WebSockets (Socket.io)
- **Port Display** — see all exposed port mappings at a glance
- **Filter & Search** — filter containers by state (running / exited)
- **Toast Notifications** — instant feedback on every action
- **Auto-Refresh** — dashboard polls every 5 seconds automatically
- **Dark UI** — clean terminal-aesthetic interface built with Tailwind CSS

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS        |
| Backend     | Node.js, Express                    |
| Docker API  | Dockerode                           |
| Real-time   | Socket.io (WebSockets)              |
| Deployment  | Docker + Docker Compose             |

---

## 🚀 Quick Start

### Option A — Docker Compose (Recommended)

```bash
git clone https://github.com/YOUR_USERNAME/devdock.git
cd devdock
docker compose up --build
```

Open **http://localhost:3000** in your browser.

> ⚠️ On Windows, make sure Docker Desktop is running before starting.

---

### Option B — Local Development

**Prerequisites:** Node.js 18+, Docker Desktop running

```bash
git clone https://github.com/saqlainbasit/devdock.git
cd devdock
```

**Start the backend:**
```bash
cd server
npm install
node index.js
# Server runs on http://localhost:5000
```

**Start the frontend:**
```bash
tp client
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 📁 Project Structure

```
devdock/
├── client/                  # React frontend
│   ├── src/
│   │   ├── fonts/           # Local JetBrains Mono font files // You can Download from here "https://fonts.google.com/specimen/JetBrains+Mono"
│   │   │   ├── JetBrainsMono-Regular.ttf
│   │   │   ├── JetBrainsMono-Medium.ttf
│   │   │   └── JetBrainsMono-SemiBold.ttf
│   │   ├── App.jsx          # Main dashboard component
│   │   └── index.css        # Tailwind + global styles
│   ├── Dockerfile
│   └── nginx.conf
│
├── server/                  # Express backend
│   ├── index.js             # API routes + Socket.io + Dockerode
│   └── Dockerfile
│
├── docker-compose.yml       # Run everything with one command
└── README.md
```

---

## 🔌 API Reference

| Method   | Endpoint                        | Description              |
|----------|---------------------------------|--------------------------|
| `GET`    | `/containers`                   | List all containers      |
| `POST`   | `/containers/:id/start`         | Start a container        |
| `POST`   | `/containers/:id/stop`          | Stop a container         |
| `POST`   | `/containers/:id/restart`       | Restart a container      |
| `DELETE` | `/containers/:id/remove`        | Remove a container       |
| `GET`    | `/containers/:id/logs`          | Fetch logs (one-shot)    |

**WebSocket Events:**

| Event              | Direction       | Description                  |
|--------------------|-----------------|------------------------------|
| `subscribe:logs`   | client → server | Start streaming logs         |
| `unsubscribe:logs` | client → server | Stop streaming               |
| `log:line`         | server → client | New log line `{type, text}`  |
| `log:end`          | server → client | Stream finished              |
| `log:error`        | server → client | Stream error                 |

---

## 🖥️ Screenshots

> Coming soon — add screenshots of your dashboard here!

---

## 🗺️ Roadmap

- [ ] Docker image manager (pull, delete, inspect)
- [ ] Volume & network explorer
- [ ] Docker Compose file upload & execution
- [ ] CPU & memory live stats charts
- [ ] JWT-based authentication

---

## 👤 Author

**Saqlain** 

---

## 📄 License

MIT — free to use and modify.
