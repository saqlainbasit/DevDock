# 🐙 GitHub

> Version control and portfolio hosting for DevDock.

← Back to [[MOC - DevDock]]

---

## Repository
**https://github.com/saqlainbasit/devdock**

---

## Structure on GitHub
```
devdock/
├── client/          # React frontend
├── server/          # Express backend
├── docker-compose.yml
└── README.md
```

---

## How to Push Changes
From `docker-dashboard/` root:
```bash
git add .
git commit -m "your message"
git push origin main
```

---

## If Push Gets Rejected
```bash
git pull origin main --allow-unrelated-histories
# if editor opens: type :q and Enter
git push origin main
```

---

## Re-init Git (after OS reinstall)
```bash
cd "D:\docker dev proj\docker-dashboard"
git init
git add .
git commit -m "feat: DevDock v1.0"
git branch -M main
git remote add origin https://github.com/saqlainbasit/devdock.git
git push -u origin main --force
```

---

## .gitignore
```
node_modules
dist
.env
*.log
```

---

## After Code Changes — Full Update Flow
```bash
# 1. Push to GitHub
git add .
git commit -m "feat: description"
git push origin main

# 2. Rebuild Docker (if running)
docker compose up --build
```

---

#devdock #devops #github #git #versioncontrol
