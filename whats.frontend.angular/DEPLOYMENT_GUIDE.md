# 🚀 WhatsApp Business Frontend - Complete Deployment & Setup Guide

## 📋 Table of Contents

1. [Quick Start (Development)](#quick-start-development)
2. [Local Network Setup](#local-network-setup)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Arabic Font & i18n Configuration](#arabic-font--i18n-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start (Development)

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org))
- npm 10+
- Angular CLI 19+

### Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server (localhost)
npm start

# 3. Open browser
# Navigate to: http://localhost:4200

# Login credentials (development only):
# Username: admin
# Password: 96579657
```

**Backend URL:** Configured to connect to `https://localhost:7256/api`

---

## Local Network Setup

### Access from Other Machines on Your Network

#### Step 1: Find Your Machine's IP Address

**Windows:**

```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**

```bash
ifconfig
# or
hostname -I
```

#### Step 2: Configure Frontend for Network Access

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
    production: false,
    // Replace with your machine's IP address
    apiUrl: 'https://192.168.1.100:7256/api',
    signalRUrl: 'https://192.168.1.100:7256/hubs/whatsapp',
    encryptionKey: 'your-development-encryption-key-change-in-production'
};
```

#### Step 3: Start Development Server with Network Access

```bash
# Run on all network interfaces (0.0.0.0)
ng serve --host 0.0.0.0 --port 4200

# Or use npm script
npm start -- --host 0.0.0.0
```

#### Step 4: Access from Another Machine

Open browser and navigate to:

```
http://192.168.1.100:4200
```

### Network Firewall Considerations

**Windows Firewall:**

```bash
# Allow port 4200 through Windows Firewall
netsh advfirewall firewall add rule name="Angular Dev Server" dir=in action=allow protocol=tcp localport=4200

# Or manually: Windows Defender Firewall > Allow an app through firewall
```

**Mac/Linux:**

```bash
# Most development servers are accessible on local network by default
# If issues, check: sudo lsof -i :4200
```

---

## Docker Deployment

### Quick Docker Start (Recommended for Staging/Internal Network)

#### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

#### Step 1: Build and Run with Docker Compose

From the workspace root directory:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and configure:
# - FRONTEND_PORT=8080 (or your desired port)
# - JWT_SECRET (generate a strong secret)
# - DATABASE_URL (if using external DB)

# 3. Build and start services
docker compose up -d

# 4. View logs
docker compose logs -f frontend
```

#### Step 2: Access the Application

```
http://localhost:8080
# or use your configured FRONTEND_PORT
```

#### Step 3: Access from Other Machines

```
http://192.168.x.x:8080
# (use your server machine's IP address)
```

### Docker Build Details

**Angular Build:**

- Multi-stage build (Node 20 → Nginx Alpine)
- Production optimization enabled
- Assets bundled and minified
- Gzip compression enabled

**Nginx Configuration:**

- Serves on port 80 (mapped to host port via compose)
- Proxy to backend API at `/api`
- WebSocket support for SignalR
- Security headers configured
- UTF-8 charset for Arabic text

### Managing Docker

```bash
# Stop services
docker compose down

# Stop but keep volumes
docker compose down --volumes

# View running containers
docker compose ps

# View service logs
docker compose logs -f frontend
docker compose logs -f backend

# Restart services
docker compose restart

# Rebuild images
docker compose up -d --build

# Remove images
docker compose down --rmi all
```

---

## Production Deployment

### Step 1: Build Production Bundle

```bash
# Create optimized production build
npm run build:prod

# Output will be in: dist/apollo-ng/browser/

# Check bundle size
npm run build:stats
# Analyze with: npm run analyze
```

### Step 2: Security Configuration

Before deploying, update `.env` and `src/environments/environment.prod.ts`:

```typescript
export const environment = {
    production: true,
    apiUrl: '/api',  // Relative path (served through reverse proxy)
    signalRUrl: '/hubs/whatsapp',
    encryptionKey: 'CHANGE-THIS-TO-SECURE-KEY', // Use crypto-strong value
    features: {
        enableLogging: false,    // Disable in production
        enableDebugMode: false,  // Disable in production
        enableMockAuth: false    // Disable in production
    }
};
```

### Step 3: Docker Production Deployment

```bash
# Build production image
docker build -t whats-frontend:latest .

# Run with production settings
docker run -d \
    --name whats-frontend-prod \
    -p 80:80 \
    -e ENVIRONMENT=production \
    whats-frontend:latest

# Or with docker compose
docker compose -f docker-compose.prod.yml up -d
```

### Step 4: HTTPS & Reverse Proxy Setup

**Using Nginx as Reverse Proxy:**

```nginx
upstream frontend {
    server frontend:80;
}

upstream backend {
    server backend:8080;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /hubs/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

**Using Caddy (Simpler):**

```caddy
yourdomain.com {
    reverse_proxy /api/* backend:8080
    reverse_proxy /hubs/* backend:8080 {
        header_up Connection upgrade
        header_up Upgrade websocket
    }
    reverse_proxy * frontend:80
}
```

### Step 5: Environment & Secrets Management

**Docker Secrets (Production):**

```bash
# Create secrets
echo "your-jwt-secret" | docker secret create jwt_secret -

# Use in compose
docker service create \
    --secret jwt_secret \
    --env-file .env.prod \
    whats-frontend:latest
```

**Environment Variables (.env.prod):**

```env
# Frontend
FRONTEND_PORT=8080
NODE_ENV=production
ANGULAR_ENV=production

# Backend
BACKEND_PORT=8080
DATABASE_URL=Server=db;Database=whatsapp;...
JWT_SECRET=CHANGE-THIS-TO-SECURE-KEY
JWT_ISSUER=whatsapp-business
JWT_AUDIENCE=whatsapp-mobile

# Security
CORS_ORIGINS=https://yourdomain.com
SESSION_SECRET=CHANGE-THIS
ENCRYPTION_KEY=CHANGE-THIS
```

### Step 6: Monitoring & Logging

**Health Check Endpoint:**

```bash
curl http://localhost:8080/health
# Response: "healthy"
```

**Container Logs:**

```bash
docker logs -f whats-frontend-prod
docker logs -f whats-backend-prod
```

**Application Metrics:**

- Monitor CPU/Memory: `docker stats`
- Check port usage: `netstat -tulpn | grep LISTEN`
- SSL certificate expiry: `openssl x509 -enddate -noout -in /path/to/cert.pem`

---

## Arabic Font & i18n Configuration

### Font Selection (Settings Panel)

The application includes 4 professional Arabic fonts:

1. **Tajawal** (Default) - Modern, clean Arabic font
2. **Poppins** - Geometric, trendy
3. **Droid Sans** - Android system font, good readability
4. **Al Jazeera Plus** - News-style Arabic font

### Language Selection

Users can switch between:

- **العربية** (Arabic) - RTL layout, Arabic UI
- **English** - LTR layout, English UI

### Customizing Fonts

Add new fonts in `src/styles.scss`:

```scss
// Add Google Font import
@import url('https://fonts.googleapis.com/css2?family=MyFont:wght@400;500;600;700&display=swap');

// Add to font options
html.font-myfont {
    --font-family-override: 'MyFont', 'Tajawal', sans-serif;
}
```

Update `src/app/layout/components/app.configurator.ts`:

```typescript
fontOptions = [
    { name: 'My Font', value: 'font-myfont' },
    // ... existing options
];
```

### Character Set & Encoding

Ensure UTF-8 encoding everywhere:

**HTML Head:**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Nginx Configuration:**

```nginx
charset utf-8;
add_header Content-Type "text/html; charset=utf-8";
```

**CSS Files:**

```scss
@charset "UTF-8";
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Arabic Text Not Rendering Correctly

**Problem:** Arabic text appears as boxes or reversed

**Solution:**

```bash
# Check font is loaded
# In browser DevTools > Network > check Tajawal font download

# Clear browser cache and rebuild
npm run build:prod
docker compose down --volumes
docker compose up -d --build
```

#### 2. Network Connection Issues

**Problem:** Cannot connect to backend from another machine

**Solutions:**

```bash
# 1. Verify backend is accessible
curl https://192.168.1.100:7256/api/health

# 2. Check firewall
netstat -tulpn | grep 7256  # Linux/Mac
netstat -ano | findstr :7256  # Windows

# 3. Verify DNS resolution
nslookup backend
ping backend
```

#### 3. Docker Build Fails

**Problem:** Docker build exits with error

**Solutions:**

```bash
# Clear Docker cache and rebuild
docker compose down --rmi all
docker compose up -d --build

# Check disk space
docker system df

# Clean up unused images
docker system prune -a
```

#### 4. Port Already in Use

**Problem:** Port 4200 (dev) or 8080 (docker) already in use

**Solutions:**

```bash
# Find process using port
lsof -i :4200              # Mac/Linux
netstat -ano | findstr :4200  # Windows

# Kill process (Linux/Mac)
kill -9 <PID>

# Or use different port
ng serve --port 4300
```

#### 5. CORS Errors

**Problem:** Frontend can't access backend API

**Solutions:**

```typescript
// In environment.ts, ensure correct URL
apiUrl: 'https://192.168.1.100:7256/api',  // Full URL for dev

// In environment.prod.ts
apiUrl: '/api',  // Relative path for production (behind proxy)
```

#### 6. WebSocket Connection Failed

**Problem:** SignalR connection fails

**Check nginx.conf:**

```nginx
location /hubs/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
}
```

---

## Performance Optimization

### Build Size

```bash
# Check bundle size
npm run build:stats
npm run analyze

# Expected sizes:
# - main.js: ~300-400KB (gzipped)
# - vendor.js: ~600-800KB (gzipped)
```

### Runtime Performance

1. **Enable Production Mode:**

   ```bash
   npm run build:prod
   ```

2. **Browser Caching:**
   Already configured in nginx.conf for static assets (1 year expiry)

3. **Gzip Compression:**
   Enabled in nginx.conf (level 6)

4. **CDN Integration:**
   For production, serve static assets from CDN:

   ```typescript
   // In environment.prod.ts
   cdn: 'https://cdn.yourdomain.com'
   ```

---

## Support & Resources

### Documentation

- [Angular 19 Docs](https://angular.io/docs)
- [PrimeNG Components](https://primeng.org)
- [Docker Compose](https://docs.docker.com/compose/)

### Common Commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Build dev bundle
npm run build:prod          # Build production bundle
npm run lint                # Run ESLint
npm test                    # Run unit tests

# Docker
docker compose up -d        # Start services
docker compose down         # Stop services
docker compose logs -f      # View logs
docker compose ps          # List containers

# Production
npm run build:prod          # Create optimized bundle
docker build -t app:latest . # Build image
docker run -p 80:80 app:latest # Run container
```

---

## Checklist Before Production Deployment

- [ ] Update `encryptionKey` in environment.prod.ts
- [ ] Update `JWT_SECRET` in .env.prod
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS origins in backend
- [ ] Set up reverse proxy (Nginx/Caddy)
- [ ] Configure monitoring & logging
- [ ] Test from internal network machines
- [ ] Backup database configuration
- [ ] Set up automated backups
- [ ] Document custom configurations
- [ ] Test disaster recovery procedures
- [ ] Review security headers in nginx.conf
- [ ] Configure CDN if using one
- [ ] Set up health checks
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on mobile devices
- [ ] Verify Arabic font rendering on all devices
- [ ] Load test with expected user count

---

## Summary

Your WhatsApp Business frontend is now ready for:
✅ Local development
✅ Internal network access
✅ Docker deployment
✅ Production deployment with HTTPS
✅ Arabic language & custom fonts
✅ Horizontal scaling

For questions or issues, refer to the troubleshooting section or check the backend documentation.

**Happy Deploying! 🚀**
