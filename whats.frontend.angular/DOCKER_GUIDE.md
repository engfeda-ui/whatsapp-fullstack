# Docker & Deployment Guide

## Stack Overview
- `docker-compose.yml` (workspace root) – boots the full stack
- `whats.frontend.angular/Dockerfile` – Angular build + Nginx runtime
- `whats.backend.aspnet/Dockerfile` – ASP.NET Core 9 publish image
- `.env` (copy from `.env.example`) – shared configuration for both services

## Prerequisites
- Docker 20.10+ and the Docker Compose plugin (`docker compose` CLI)
- Node.js 20+ only if you develop outside containers
- An editor that can work with multi-project workspaces

## Quick Start (Docker Compose)
1. From the workspace root, copy the template: `cp .env.example .env`
2. Update secrets (`JWT_SECRET`) and optional ports inside `.env`
3. Build and launch the stack: `docker compose up --build -d`
4. Follow logs if needed: `docker compose logs -f backend`
5. Open http://localhost:8080 for the Angular UI  
   (REST API is exposed via the same host at `/api`)

To stop containers without deleting volumes: `docker compose down`

## Services & Ports
- `frontend` → host `FRONTEND_PORT` (default 8080) → container port 80
- `backend` → host `BACKEND_PORT` (default 8080) → container port 8080  
  The backend also mounts the `backend-data` volume at `/data` for the SQLite database.

## Key Environment Overrides
- `FRONTEND_PORT` – published port for Angular+Nginx
- `BACKEND_PORT` – published port for ASP.NET API
- `BACKEND_CONNECTION_STRING` – override SQLite connection (e.g., external DB)
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE` – authentication settings
- `FRONTEND_ORIGIN` – adds the UI origin to CORS when not using the built-in proxy

## Troubleshooting
- `docker compose ps` – verify containers are healthy
- `docker compose logs backend` – inspect ASP.NET logs (watch for EF migration errors)
- Port already in use → adjust `FRONTEND_PORT`/`BACKEND_PORT` in `.env`
- Reset the stack without losing the DB: `docker compose down && docker compose up -d`

## Production Notes
- Replace the default secrets in `.env` before exposing publicly
- Place Docker behind an HTTPS reverse proxy (Traefik, Nginx, Caddy) for TLS
- For high availability, push pre-built images to a registry and deploy via your chosen orchestrator (Swarm, Kubernetes, etc.)

## Extending the Stack
- Add databases, queues, or caches by extending `docker-compose.yml`
- Update `nginx.conf` if additional proxy rules or headers are required
- Backend settings can be tuned via additional `ConnectionStrings__...` or `AzureOpenAI__...` variables
