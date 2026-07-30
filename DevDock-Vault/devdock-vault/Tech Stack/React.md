# ⚛️ React

> JavaScript UI library used to build the DevDock frontend.

← Back to [[MOC - DevDock]] | Used in [[Frontend]]

---

## Version
React 19 with Vite 8 as the build tool.

---

## Why React?
- Component-based — each part of the UI is isolated
- State management with hooks — no Redux needed for this scale
- Fast re-renders — only updates what changed

---

## Hooks Used in DevDock

| Hook | Where | Purpose |
|------|-------|---------|
| useState | App, LogModal, ActionBtn | local state |
| useEffect | App, LogModal | side effects, data fetching |
| useCallback | App | stable fetchContainers reference |
| useRef | LogModal | auto-scroll bottom anchor |

---

## Key Patterns

### Auto-refresh
```js
useEffect(() => {
  fetchContainers();
  const interval = setInterval(fetchContainers, 5000);
  return () => clearInterval(interval); // cleanup
}, [fetchContainers]);
```

### Conditional rendering
```js
{isRunning && <ActionBtn ...>■ Stop</ActionBtn>}
{!isRunning && <ActionBtn ...>▶ Start</ActionBtn>}
```

---

## Connected To
- [[Frontend]] — where React lives
- [[Tailwind CSS]] — styling
- [[Socket.io]] — real-time logs

---

#devdock #tech #react #javascript
