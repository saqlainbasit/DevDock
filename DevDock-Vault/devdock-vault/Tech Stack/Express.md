# 🚂 Express

> Minimal Node.js web framework powering the DevDock backend API.

← Back to [[MOC - DevDock]] | Used in [[Backend]]

---

## Version
Express 5.1.0 (latest major version)

---

## Why Express?
- Minimal and fast — perfect for a simple REST API
- Easy route definition
- Works seamlessly with Socket.io via `http.createServer`

---

## Server Setup in DevDock
```js
const app = express();
const server = http.createServer(app); // shared with Socket.io
app.use(cors());
app.use(express.json());
server.listen(5000);
```

---

## Route Pattern
```js
app.get("/containers", handler)
app.post("/containers/:id/start", handler)
app.post("/containers/:id/stop", handler)
app.post("/containers/:id/restart", handler)
app.delete("/containers/:id/remove", handler)
app.get("/containers/:id/logs", handler)
```

Full details → [[REST Endpoints]]

---

## Error Handling Pattern
Every route uses the same pattern:
```js
try {
  // do the thing
  res.json({ message: "Success" });
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

---

## Connected To
- [[Backend]] — where Express lives
- [[Dockerode]] — called inside route handlers
- [[Socket.io]] — shares the same HTTP server

---

#devdock #tech #express #nodejs #backend
