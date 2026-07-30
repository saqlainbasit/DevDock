# 📅 Phase 2 - Core Controls

← Back to [[MOC - DevDock]]

**Status:** ✅ Complete

## Goal
Add all container management actions.

## Tasks Completed
- Fixed broken server routes (were nested inside GET handler — critical bug)
- Added start / stop / restart / remove / logs endpoints
- Cross-platform Docker socket support
- Connected action buttons in React to API

## Key Learning
Inline styles require `var()` for theming — Tailwind utility classes can't drive dynamic theme changes when components rely on inline styles.

## Bug Fixed
Routes were incorrectly nested inside the GET /containers handler. They were unreachable. Moved them to top level.

---
*Previous: [[Phase 1 - Foundation]] | Next: [[Phase 3 - Live Features]]*
