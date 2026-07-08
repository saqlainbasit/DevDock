# 🐙 Docker Compose

> Runs the entire DevDock stack with a single command.

← Back to [[MOC - DevDock]] | Part of [[System Architecture]]

---

## The Command
```bash
docker compose up --build
```
Builds both images and starts both containers. That's it.

---

## Services

### client (React + Nginx)
- Builds React app with Node.js
- Serves built files via Nginx
- Accessible at **http://localhost:3000**

### server (Express + Node.js)
- Runs the backend API
- Mounts Docker socket for container management
- Accessible at **http://localhost:5000**

---

## docker-compose.yml
```yaml
version: "3.9"

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: devdock-server
    ports:
      - "5000:5000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: devdock-client
    ports:
      - "3000:80"
    depends_on:
      - server
    restart: unless-stopped
```

---

## The Docker Socket Mount
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```
This is what gives DevDock the ability to manage other containers — it gives the server container access to the host's Docker Engine.

---

## Useful Commands
```bash
docker compose up --build    # build and start
docker compose down          # stop and remove containers
docker compose logs          # view logs
docker compose ps            # check status
```

---

## Client Dockerfile (Multi-stage)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

#devdock #devops #docker #compose #deployment
