# ⚛️ Frontend

> React + Vite application served via Nginx on port 3000.

← Back to [[MOC - DevDock]] | Part of [[System Architecture]]

---

## Stack
- [[React]] — component framework
- [[Tailwind CSS]] — utility styling
- [[Socket.io]] — WebSocket client for live logs

---

## File Structure
```
client/
├── src/
│   ├── App.jsx        ← entire UI lives here
│   ├── index.css      ← Tailwind + CSS variables for theming
│   └── fonts/         ← local JetBrains Mono .ttf files
├── Dockerfile         ← multi-stage: build → Nginx
├── nginx.conf         ← serves SPA, handles routing
└── package.json
```

---

## Component Breakdown

### App() — main component
- Holds all state
- Fetches containers every 5 seconds
- Renders header, stats, filters, grid

### ContainerCard
- Receives one container as prop
- Shows name, image, status badge, ports
- Has action buttons → [[Action Buttons]]

### LogModal
- Opens when user clicks Logs
- Connects to Socket.io → [[Live Log Streaming]]
- Auto-scrolls, clear button, line count

### Toast
- Fixed bottom-right notifications
- Auto-dismisses after 3 seconds

### ActionBtn
- Reusable button with hover color effect
- Used inside ContainerCard

---

## Theming System
Uses CSS custom properties (variables).
See → [[Theme Toggle]]

---

## Key Dependencies
```json
"react": "^19.2.6"
"axios": "^1.16.1"
"socket.io-client": "^4.8.3"
"tailwindcss": "^4.3.0"
```

---

#devdock #frontend #react #components
