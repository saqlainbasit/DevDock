# 🎮 Action Buttons

> Per-container action buttons that trigger REST API calls.

← Back to [[MOC - DevDock]] | Uses [[REST Endpoints]] | Lives in [[Frontend]]

---

## Available Actions

| Button | Color | Condition | API Call |
|--------|-------|-----------|----------|
| ▶ Start | green | container stopped | POST /containers/:id/start |
| ■ Stop | orange | container running | POST /containers/:id/stop |
| ↺ Restart | blue | container running | POST /containers/:id/restart |
| 📋 Logs | purple | always | opens [[Live Log Streaming]] |
| ✕ Remove | red | always | DELETE /containers/:id/remove |

---

## Smart Visibility
Buttons show/hide based on container state:
```js
{!isRunning && <ActionBtn color="#22c55e" onClick={() => onAction("start", ...)}>▶ Start</ActionBtn>}
{isRunning  && <ActionBtn color="#f97316" onClick={() => onAction("stop",  ...)}>■ Stop</ActionBtn>}
{isRunning  && <ActionBtn color="#38bdf8" onClick={() => onAction("restart",...)}>↺ Restart</ActionBtn>}
```

---

## Hover Effect
Each button reveals its color on hover:
```js
background: hovered ? color + "22" : "transparent",
border: `1px solid ${hovered ? color : "var(--border-main)"}`,
color: hovered ? color : "var(--text-muted)",
```
The `"22"` appended to hex = 13% opacity background tint.

---

## Remove Confirmation
Remove shows a browser confirm dialog before executing:
```js
if (action === "remove" && !confirm(`Remove container "${name}"?`)) return;
```

---

## Toast Feedback
Every action shows a toast notification on success or failure.
See → [[MOC - DevDock]]

---

#devdock #feature #actions #buttons #ux
