import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "http://localhost:5000";

const STATUS_COLOR = {
  running: { bg: "#0d2b1a", text: "#22c55e", dot: "#22c55e" },
  exited:  { bg: "#1e1e1e", text: "#6b7280", dot: "#4b5563" },
  paused:  { bg: "#1c1a0d", text: "#eab308", dot: "#eab308" },
  created: { bg: "#0d1f2b", text: "#38bdf8", dot: "#38bdf8" },
};

function getColors(state) {
  return STATUS_COLOR[state] || STATUS_COLOR.exited;
}

// ─── TOAST ───────────────────────────────────────────────────

function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 999 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: t.type === "error" ? "#3f1212" : "#0d2b1a",
          border: `1px solid ${t.type === "error" ? "#ef4444" : "#22c55e"}`,
          color: t.type === "error" ? "#f87171" : "#4ade80",
          padding: "10px 16px", borderRadius: 8, fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          animation: "slideIn 0.2s ease",
        }}>
          {t.type === "error" ? "✗" : "✓"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── LIVE LOG MODAL ───────────────────────────────────────────

function LogModal({ containerId, containerName, onClose }) {
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState("connecting");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const socket = io(API);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("live");
      socket.emit("subscribe:logs", containerId);
    });

    socket.on("connect_error", () => setStatus("error"));

    socket.on("log:line", ({ type, text }) => {
      const raw = text.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f]/g, "");
      const lineItems = raw.split("\n").filter(l => l.trim());
      setLines(prev => [...prev, ...lineItems.map(l => ({ text: l, type, id: Math.random() }))]);
    });

    socket.on("log:end", () => setStatus("ended"));
    socket.on("log:error", (msg) => {
      setLines(prev => [...prev, { text: `Error: ${msg}`, type: "stderr", id: Math.random() }]);
      setStatus("error");
    });

    return () => {
      socket.emit("unsubscribe:logs");
      socket.disconnect();
    };
  }, [containerId]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, autoScroll]);

  const statusConfig = {
    connecting: { color: "#eab308", label: "● connecting..." },
    live:       { color: "#22c55e", label: "● live" },
    ended:      { color: "#6b7280", label: "○ stream ended" },
    error:      { color: "#ef4444", label: "✗ error" },
  };
  const sc = statusConfig[status];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }} onClick={onClose}>
      <div style={{
        background: "#0a0a0a", border: "1px solid #1f1f1f",
        borderRadius: 12, width: "min(900px, 92vw)", height: "78vh",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }} onClick={e => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{
          padding: "12px 16px", borderBottom: "1px solid #1a1a1a",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#0d0d0d", gap: 12, flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e5e5e5", fontSize: 13, fontWeight: 600 }}>
              📋 {containerName}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sc.color }}>
              {sc.label}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#333" }}>
              {lines.length} lines
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAutoScroll(a => !a)} style={{
              background: autoScroll ? "#0d2b1a" : "transparent",
              border: `1px solid ${autoScroll ? "#22c55e" : "#333"}`,
              color: autoScroll ? "#22c55e" : "#555",
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>↓ auto-scroll</button>
            <button onClick={() => setLines([])} style={{
              background: "transparent", border: "1px solid #333", color: "#555",
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>✕ clear</button>
            <button onClick={onClose} style={{
              background: "transparent", border: "1px solid #333", color: "#555",
              padding: "4px 10px", borderRadius: 6, fontSize: 11,
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>✕ close</button>
          </div>
        </div>

        {/* Log Body */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "12px 16px",
          background: "#050505",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.75,
        }}>
          {lines.length === 0 && status === "connecting" ? (
            <div style={{ color: "#333", animation: "pulse 1.5s infinite" }}>waiting for logs...</div>
          ) : lines.length === 0 ? (
            <div style={{ color: "#333" }}>(no output)</div>
          ) : (
            lines.map(line => (
              <div key={line.id} style={{
                color: line.type === "stderr" ? "#f87171" : "#86efac",
                wordBreak: "break-all", padding: "1px 0",
              }}>
                {line.text}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

// ─── ACTION BUTTON ────────────────────────────────────────────

function ActionBtn({ color, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color + "22" : "transparent",
        border: `1px solid ${hovered ? color : "#2a2a2a"}`,
        color: hovered ? color : "#555",
        padding: "5px 12px", borderRadius: 6, fontSize: 11,
        cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
        transition: "all 0.15s",
      }}>
      {children}
    </button>
  );
}

// ─── CONTAINER CARD ───────────────────────────────────────────

function ContainerCard({ container, onAction }) {
  const colors = getColors(container.State);
  const name = container.Names[0].replace("/", "");
  const isRunning = container.State === "running";
  const ports = container.Ports?.filter(p => p.PublicPort).map(p => `${p.PublicPort}→${p.PrivatePort}`).join(", ") || null;

  return (
    <div style={{
      background: "#111111", border: "1px solid #1f1f1f",
      borderRadius: 10, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 12,
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#333"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1f1f1f"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e5e5e5", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {name}
          </div>
          <div style={{ color: "#525252", fontSize: 12, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {container.Image}
          </div>
        </div>
        <div style={{
          background: colors.bg, color: colors.text,
          fontSize: 11, padding: "3px 10px", borderRadius: 20,
          fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5, flexShrink: 0
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors.dot, display: "inline-block" }} />
          {container.State}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 12, color: "#404040", fontFamily: "'JetBrains Mono', monospace" }}>{container.Status}</div>
        {ports && <div style={{ fontSize: 11, color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace" }}>🔌 {ports}</div>}
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
        {!isRunning && <ActionBtn color="#22c55e" onClick={() => onAction("start", container.Id, name)}>▶ Start</ActionBtn>}
        {isRunning  && <ActionBtn color="#f97316" onClick={() => onAction("stop", container.Id, name)}>■ Stop</ActionBtn>}
        {isRunning  && <ActionBtn color="#38bdf8" onClick={() => onAction("restart", container.Id, name)}>↺ Restart</ActionBtn>}
        <ActionBtn color="#a855f7" onClick={() => onAction("logs", container.Id, name)}>📋 Logs</ActionBtn>
        <ActionBtn color="#ef4444" onClick={() => onAction("remove", container.Id, name)}>✕ Remove</ActionBtn>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────

export default function App() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [logModal, setLogModal] = useState(null);
  const [filter, setFilter] = useState("all");

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const fetchContainers = useCallback(() => {
    axios.get(`${API}/containers`)
      .then(res => { setContainers(res.data); setError(null); })
      .catch(() => setError("Cannot connect to DevDock server. Is it running on :5000?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, [fetchContainers]);

  const handleAction = async (action, id, name) => {
    if (action === "logs") { setLogModal({ id, name }); return; }
    if (action === "remove" && !confirm(`Remove container "${name}"?`)) return;
    try {
      if (action === "remove") await axios.delete(`${API}/containers/${id}/remove`);
      else await axios.post(`${API}/containers/${id}/${action}`);
      addToast(`${name}: ${action} successful`);
      setTimeout(fetchContainers, 600);
    } catch (err) {
      addToast(`${name}: ${err.response?.data?.error || err.message}`, "error");
    }
  };

  const filtered = containers.filter(c => filter === "all" ? true : c.State === filter);
  const counts = {
    all: containers.length,
    running: containers.filter(c => c.State === "running").length,
    exited: containers.filter(c => c.State === "exited").length,
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; color: #e5e5e5; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808" }}>
        <header style={{
          borderBottom: "1px solid #141414", padding: "0 32px",
          height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#080808", zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🐳</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>DevDock</span>
            <span style={{ background: "#0d2b1a", color: "#22c55e", fontSize: 10, padding: "2px 8px", borderRadius: 20, fontFamily: "'JetBrains Mono', monospace", marginLeft: 4 }}>v1.0</span>
          </div>
          <button onClick={fetchContainers} style={{
            background: "transparent", border: "1px solid #222", color: "#555",
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12, transition: "all 0.15s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#aaa"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#555"; }}
          >↻ refresh</button>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {[
              { label: "total",   value: counts.all,    color: "#e5e5e5" },
              { label: "running", value: counts.running, color: "#22c55e" },
              { label: "stopped", value: counts.exited,  color: "#6b7280" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 8, padding: "12px 20px", minWidth: 100 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#404040", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {["all", "running", "exited"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#1a1a1a" : "transparent",
                border: `1px solid ${filter === f ? "#333" : "#1a1a1a"}`,
                color: filter === f ? "#e5e5e5" : "#404040",
                padding: "6px 14px", borderRadius: 6, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, transition: "all 0.15s"
              }}>
                {f} ({f === "all" ? counts.all : f === "running" ? counts.running : counts.exited})
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'JetBrains Mono', monospace", color: "#333", fontSize: 13 }}>
              <div style={{ animation: "pulse 1.5s infinite" }}>connecting to docker...</div>
            </div>
          ) : error ? (
            <div style={{ background: "#1a0808", border: "1px solid #3f1212", borderRadius: 10, padding: "24px", color: "#f87171", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              ✗ {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#333", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
              no {filter === "all" ? "" : filter} containers found
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {filtered.map(c => <ContainerCard key={c.Id} container={c} onAction={handleAction} />)}
            </div>
          )}
        </main>
      </div>

      {logModal && <LogModal containerId={logModal.id} containerName={logModal.name} onClose={() => setLogModal(null)} />}
      <Toast toasts={toasts} />
    </>
  );
}
