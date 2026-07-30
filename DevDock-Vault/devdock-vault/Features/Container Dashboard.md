# 📦 Container Dashboard

> The main view — a responsive grid of container cards showing all Docker containers.

← Back to [[MOC - DevDock]] | Lives in [[Frontend]]

---

## What It Does
- Fetches all containers (running + stopped) from [[REST Endpoints]]
- Displays them in a responsive grid
- Auto-refreshes every 5 seconds
- Filterable by state

---

## Stats Bar
Three counters at the top:
| Stat | Color |
|------|-------|
| Total containers | white |
| Running | green |
| Stopped | grey |

---

## Filter Tabs
```
[ all (3) ]  [ running (3) ]  [ exited (0) ]
```
Clicking filters the grid instantly — no refetch needed.

---

## Container Card
Each card shows:
- **Name** — container name (truncated if long)
- **Image** — Docker image used
- **Status badge** — color coded by state
- **Uptime** — e.g. "Up 2 hours"
- **Ports** — exposed port mappings in blue
- **Action buttons** → [[Action Buttons]]

---

## Status Colors
| State | Badge Color |
|-------|------------|
| running | green |
| exited | grey |
| paused | yellow |
| created | blue |

---

## Auto-Refresh
```js
const interval = setInterval(fetchContainers, 5000);
```
Polls every 5 seconds silently in the background.

---

#devdock #feature #dashboard #containers
