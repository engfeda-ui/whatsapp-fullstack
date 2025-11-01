# 🚀 Quick Start Guide - WhatsApp Business Application

**Last Updated:** November 1, 2025
**Status:** ✅ Production Ready

---

## 5-Minute Quick Start

### 1. Start Frontend (Local)
```bash
cd whats.frontend.angular
npm install
npm start
# Open: http://localhost:4200
```

### 2. Login
```
Username: admin
Password: 96579657
```

### 3. Change Settings
- Click ⚙️ gear icon (bottom right)
- Select language: **العربية** or **English**
- Select font: **Tajawal**, **Poppins**, **Droid Sans**, or **Al Jazeera**
- Verify Arabic text renders correctly

---

## Access from Another Machine (Same Network)

```bash
# 1. Get your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Update environment file
# Edit: src/environments/environment.ts
# Change: apiUrl to your IP

# 3. Start server on all interfaces
ng serve --host 0.0.0.0

# 4. Access from another machine
# http://192.168.x.x:4200
```

---

## Docker Deployment (Staging/Production)

```bash
# From workspace root
docker compose up -d

# Access
# http://localhost:8080

# View logs
docker compose logs -f frontend

# Stop
docker compose down
```

---

## What Was Fixed

✅ **Arabic Font Rendering** - Now displays perfectly
✅ **Language Selection** - Switch between العربية and English
✅ **Font Selection** - Choose from 4 professional fonts
✅ **Network Access** - Works on internal network
✅ **Production Ready** - Complete deployment guides included

---

## Key Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete deployment instructions |
| `PRODUCTION_CHECKLIST.md` | Pre-deployment verification |
| `IMPLEMENTATION_SUMMARY.md` | Technical implementation details |
| `src/styles.scss` | Arabic font configuration |
| `src/app.component.ts` | Initialize language/font settings |

---

## Common Commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Build dev bundle
npm run build:prod          # Production build
npm run lint                # Check code quality

# Docker
docker compose up -d        # Start services
docker compose down         # Stop services
docker compose logs -f      # View logs
```

---

## Troubleshooting

**Arabic text looks wrong?**
→ Clear browser cache (Ctrl+Shift+R)

**Can't connect to backend?**
→ Update environment.ts with correct IP

**Docker won't start?**
→ Run: `docker system prune -a`

---

## Next Steps

1. ✅ Start the application
2. ✅ Test Arabic rendering
3. ✅ Try language switching
4. ✅ Try font selection
5. 📖 Read DEPLOYMENT_GUIDE.md
6. 📋 Follow PRODUCTION_CHECKLIST.md
7. 🚀 Deploy to production

---

**For detailed instructions, see DEPLOYMENT_GUIDE.md**

**Status:** ✅ Ready to deploy
