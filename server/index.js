const express = require("express");
const cors = require("cors");
const Docker = require("dockerode");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = 5000;

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Cross-platform Docker connection
const docker = new Docker(
  process.platform === "win32"
    ? { socketPath: "//./pipe/docker_engine" }
    : { socketPath: "/var/run/docker.sock" }
);

// ─── REST ROUTES ─────────────────────────────────────────────

// GET all containers
app.get("/containers", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// START
app.post("/containers/:id/start", async (req, res) => {
  try {
    await docker.getContainer(req.params.id).start();
    res.json({ message: "Container started" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// STOP
app.post("/containers/:id/stop", async (req, res) => {
  try {
    await docker.getContainer(req.params.id).stop();
    res.json({ message: "Container stopped" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RESTART
app.post("/containers/:id/restart", async (req, res) => {
  try {
    await docker.getContainer(req.params.id).restart();
    res.json({ message: "Container restarted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REMOVE
app.delete("/containers/:id/remove", async (req, res) => {
  try {
    await docker.getContainer(req.params.id).remove({ force: true });
    res.json({ message: "Container removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGS (one-shot, still kept as fallback)
app.get("/containers/:id/logs", async (req, res) => {
  try {
    const logs = await docker.getContainer(req.params.id).logs({
      stdout: true,
      stderr: true,
      tail: 100,
    });
    res.send(logs.toString());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── SOCKET.IO — LIVE LOG STREAMING ──────────────────────────

// Track active log streams so we can kill them on disconnect
const activeStreams = new Map();

io.on("connection", (socket) => {
  console.log(`[ws] client connected: ${socket.id}`);

  // Client requests live logs for a container
  socket.on("subscribe:logs", async (containerId) => {
    // Kill any existing stream for this socket
    if (activeStreams.has(socket.id)) {
      try { activeStreams.get(socket.id).destroy(); } catch (_) {}
      activeStreams.delete(socket.id);
    }

    try {
      const container = docker.getContainer(containerId);

      const stream = await container.logs({
        follow: true,       // live stream
        stdout: true,
        stderr: true,
        tail: 100,          // send last 100 lines first
        timestamps: true,
      });

      activeStreams.set(socket.id, stream);

      // Docker multiplexes stdout/stderr — demux it
      container.modem.demuxStream(
        stream,
        {
          write: (chunk) => {
            socket.emit("log:line", { type: "stdout", text: chunk.toString("utf8") });
          },
        },
        {
          write: (chunk) => {
            socket.emit("log:line", { type: "stderr", text: chunk.toString("utf8") });
          },
        }
      );

      stream.on("end", () => {
        socket.emit("log:end");
        activeStreams.delete(socket.id);
      });

      stream.on("error", (err) => {
        socket.emit("log:error", err.message);
        activeStreams.delete(socket.id);
      });

    } catch (err) {
      socket.emit("log:error", err.message);
    }
  });

  // Client stops watching logs
  socket.on("unsubscribe:logs", () => {
    if (activeStreams.has(socket.id)) {
      try { activeStreams.get(socket.id).destroy(); } catch (_) {}
      activeStreams.delete(socket.id);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    if (activeStreams.has(socket.id)) {
      try { activeStreams.get(socket.id).destroy(); } catch (_) {}
      activeStreams.delete(socket.id);
    }
    console.log(`[ws] client disconnected: ${socket.id}`);
  });
});

// ─── START ────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`🐳 DevDock server running on port ${PORT}`);
});