# 🌙 Theme Toggle

> Animated dark/light mode toggle in the header. Uses CSS custom properties for instant full-page theming.

← Back to [[MOC - DevDock]] | Lives in [[Frontend]]

---

## How It Works

### 1. React State
```js
const [isDark, setIsDark] = useState(true);
```

### 2. useEffect applies theme
```js
useEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}, [isDark]);
```

### 3. CSS Variables switch
```css
:root {
  --bg-main: #080808;
  --text-primary: #e5e5e5;
  /* dark values */
}

[data-theme="light"] {
  --bg-main: #f4f4f5;
  --text-primary: #18181b;
  /* light values */
}
```

### 4. All components use var()
```js
style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}
```

---

## CSS Variables Used

| Variable | Dark | Light |
|----------|------|-------|
| --bg-main | #080808 | #f4f4f5 |
| --bg-card | #111111 | #ffffff |
| --bg-header | #080808 | #ffffff |
| --bg-stat | #0f0f0f | #ffffff |
| --border-main | #1f1f1f | #e4e4e7 |
| --border-hover | #333333 | #a1a1aa |
| --text-primary | #e5e5e5 | #18181b |
| --text-muted | #525252 | #71717a |
| --text-dim | #404040 | #a1a1aa |

---

## Toggle Animation
- Thumb slides with spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Moon icon in dark mode, Sun icon in light mode
- Background transitions with `0.4s ease`

---

## Why CSS Variables (not Tailwind classes)?
Because components use inline styles — Tailwind classes don't apply to inline style props. CSS variables work everywhere. ✅

---

#devdock #feature #theme #darkmode #css
