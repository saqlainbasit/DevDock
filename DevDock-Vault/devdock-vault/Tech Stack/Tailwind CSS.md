# 🎨 Tailwind CSS

> Utility-first CSS framework used for styling the DevDock frontend.

← Back to [[MOC - DevDock]] | Used in [[Frontend]]

---

## Version
Tailwind CSS 4.3.0 via `@tailwindcss/vite` plugin

---

## Setup
```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* index.css */
@import "tailwindcss";
```

No `tailwind.config.js` needed with v4. ✅

---

## How It's Used in DevDock
Most of the UI uses **inline styles** (not Tailwind classes) because components were built before Tailwind was added. Tailwind mainly provides:
- CSS reset/base styles
- Font utilities where applicable

---

## Theming — Why Not Tailwind Dark Mode?
Tailwind's dark mode works with class names, but DevDock components use inline styles. So we use **CSS custom properties** instead.
See → [[Theme Toggle]]

---

## Fonts
JetBrains Mono loaded locally from `.ttf` files:
```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('./fonts/JetBrainsMono-Regular.ttf') format('truetype');
  font-weight: 400;
}
```

---

## Connected To
- [[Frontend]] — where Tailwind is used
- [[Theme Toggle]] — theming system that works alongside Tailwind

---

#devdock #tech #tailwind #css #styling
