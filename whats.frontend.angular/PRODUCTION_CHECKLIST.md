# ✅ Production Deployment Checklist

## Pre-Deployment Phase

### 1. Security Review
- [ ] Review and update `src/environments/environment.prod.ts`
  - [ ] Change `encryptionKey` to a cryptographically secure value
  - [ ] Disable all debug features (`enableDebugMode: false`)
  - [ ] Disable mock authentication (`enableMockAuth: false`)
  - [ ] Disable logging in production (`enableLogging: false`)

- [ ] Update `.env.prod` file
  - [ ] Generate strong `JWT_SECRET` (min 32 characters)
  - [ ] Set `JWT_ISSUER` to your domain
  - [ ] Set `JWT_AUDIENCE` appropriately
  - [ ] Update `CORS_ORIGINS` to production domains

- [ ] SSL/TLS Configuration
  - [ ] Obtain valid SSL certificate (not self-signed)
  - [ ] Configure HTTPS in reverse proxy
  - [ ] Set HSTS header: `Strict-Transport-Security: max-age=31536000`
  - [ ] Disable HTTP, redirect to HTTPS only

### 2. Code Quality
- [ ] Run all linting checks
  ```bash
  npm run lint
  npm run format:check
  ```

- [ ] Run unit tests
  ```bash
  npm run test:ci
  npm run test:coverage
  ```

- [ ] Fix all critical issues
  - [ ] No console errors in production build
  - [ ] No security vulnerabilities detected
  - [ ] No TypeScript compilation errors

### 3. Build Verification
- [ ] Create production build
  ```bash
  npm run build:prod
  ```

- [ ] Verify build output
  - [ ] Check `dist/apollo-ng/browser/` exists
  - [ ] Check bundle sizes are reasonable
  - [ ] Verify source maps are excluded
  - [ ] Confirm all assets are included

### 4. Configuration Validation
- [ ] Verify API endpoints
  - [ ] Update all API URLs to production backend
  - [ ] Ensure relative paths for Docker setup (`/api`)
  - [ ] Test API connectivity before deployment

- [ ] Check environment variables
  - [ ] All required vars are set in `.env.prod`
  - [ ] No default development values remain
  - [ ] Secrets are stored securely (not in code)

## Deployment Phase

### 5. Docker Setup
- [ ] Build Docker image
  ```bash
  docker build -t whats-frontend:v1.0.0 .
  ```

- [ ] Tag image for registry (if using)
  ```bash
  docker tag whats-frontend:v1.0.0 registry.company.com/whats-frontend:v1.0.0
  docker push registry.company.com/whats-frontend:v1.0.0
  ```

- [ ] Test image locally
  ```bash
  docker run -p 8080:80 whats-frontend:v1.0.0
  # Visit http://localhost:8080
  ```

### 6. Reverse Proxy Setup
- [ ] Configure Nginx or Caddy
  - [ ] SSL certificate path is correct
  - [ ] Proxy settings point to correct backend
  - [ ] CORS headers are configured
  - [ ] Security headers are set
  - [ ] Gzip compression is enabled

- [ ] Test reverse proxy
  ```bash
  curl -I https://yourdomain.com
  # Should return 200 OK with proper headers
  ```

### 7. Network & Firewall
- [ ] Open required ports
  - [ ] Port 80 (HTTP redirect)
  - [ ] Port 443 (HTTPS)
  - [ ] Backend API port (if not behind proxy)

- [ ] Configure firewall rules
  - [ ] Allow frontend service ports
  - [ ] Allow backend service ports
  - [ ] Restrict admin access
  - [ ] Log all connections

- [ ] DNS Configuration
  - [ ] DNS record points to correct IP
  - [ ] Propagation is complete (check `nslookup`)
  - [ ] No DNS resolution issues

### 8. Database & Persistence
- [ ] Backend database is ready
  - [ ] Database is accessible
  - [ ] Migrations are applied
  - [ ] Backup exists

- [ ] Configure volumes (if using Docker)
  - [ ] Persistent storage paths are correct
  - [ ] Volume permissions are set properly
  - [ ] Backup strategy is in place

## Post-Deployment Phase

### 9. Verification & Testing
- [ ] Frontend loads correctly
  - [ ] Access via HTTPS works
  - [ ] No mixed content warnings (all resources via HTTPS)
  - [ ] Security indicators show secure connection

- [ ] Functionality testing
  - [ ] Login works correctly
  - [ ] Arabic text renders properly
  - [ ] Font selection works
  - [ ] Language switching works (if implemented)
  - [ ] All forms submit correctly
  - [ ] API calls return expected data

- [ ] Cross-browser testing
  - [ ] Chrome/Chromium latest
  - [ ] Firefox latest
  - [ ] Safari latest
  - [ ] Edge latest

- [ ] Mobile testing
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Responsive layout works
  - [ ] Touch interactions work

### 10. Performance Testing
- [ ] Measure load times
  ```bash
  # Check with browser DevTools
  # Expected: First Contentful Paint < 2s
  # Expected: Largest Contentful Paint < 2.5s
  ```

- [ ] Test from various locations
  - [ ] Same network
  - [ ] Different geographic locations
  - [ ] Different network speeds (4G/5G/WiFi)

- [ ] Monitor resource usage
  - [ ] CPU usage is reasonable
  - [ ] Memory usage is stable
  - [ ] Network bandwidth is optimized

### 11. Security Testing
- [ ] Security headers check
  ```bash
  curl -I https://yourdomain.com | grep -i "x-"
  # Should show security headers
  ```

- [ ] SSL/TLS check
  - [ ] Use https://www.ssllabs.com/ssltest/
  - [ ] Target: A+ rating
  - [ ] No weak protocols or ciphers

- [ ] OWASP testing
  - [ ] No XSS vulnerabilities
  - [ ] CSRF protection enabled
  - [ ] No SQL injection risks (backend)
  - [ ] Proper input validation

### 12. Monitoring & Logging
- [ ] Set up monitoring
  - [ ] Application uptime monitoring
  - [ ] Error rate tracking
  - [ ] Performance metrics collection
  - [ ] Health check endpoint

- [ ] Configure logging
  - [ ] Application logs are captured
  - [ ] Access logs are archived
  - [ ] Error logs are monitored
  - [ ] Log rotation is configured

- [ ] Set up alerts
  - [ ] High CPU/Memory usage alert
  - [ ] Service down alert
  - [ ] Certificate expiry alert
  - [ ] Error rate threshold alert

### 13. Backup & Disaster Recovery
- [ ] Database backup
  - [ ] Automated daily backups
  - [ ] Backup location is secure
  - [ ] Restore procedure is tested

- [ ] Configuration backup
  - [ ] Docker compose files are versioned
  - [ ] Environment files are backed up (securely)
  - [ ] SSL certificates are backed up
  - [ ] Configuration history is maintained

- [ ] Disaster recovery plan
  - [ ] RTO (Recovery Time Objective) defined
  - [ ] RPO (Recovery Point Objective) defined
  - [ ] Restore procedure is documented
  - [ ] Recovery has been tested

### 14. Documentation
- [ ] Create deployment documentation
  - [ ] Infrastructure diagram
  - [ ] Service dependencies
  - [ ] Port mappings
  - [ ] Troubleshooting guide

- [ ] Document access procedures
  - [ ] Admin access procedures
  - [ ] Log access procedures
  - [ ] Database access procedures
  - [ ] Emergency access procedures

- [ ] Update runbooks
  - [ ] Service restart procedure
  - [ ] Database maintenance procedure
  - [ ] Log cleanup procedure
  - [ ] Certificate renewal procedure

## Ongoing Maintenance

### 15. Regular Checks (Daily)
- [ ] Service health
  ```bash
  curl https://yourdomain.com/health
  ```

- [ ] Error logs
  - [ ] Check for unexpected errors
  - [ ] Address critical issues immediately

- [ ] Resource usage
  - [ ] CPU usage < 70%
  - [ ] Memory usage < 80%
  - [ ] Disk space > 20% free

### 16. Weekly Checks
- [ ] Backup verification
  - [ ] Latest backup exists
  - [ ] Backup integrity is verified
  - [ ] Restore test is successful

- [ ] Security review
  - [ ] No unusual login attempts
  - [ ] No suspicious API calls
  - [ ] Firewall rules are intact

### 17. Monthly Checks
- [ ] Performance review
  - [ ] Average response time
  - [ ] Error rate trends
  - [ ] User load patterns

- [ ] Security updates
  - [ ] Check for package updates
  - [ ] Review security advisories
  - [ ] Update dependencies if needed

- [ ] Capacity planning
  - [ ] Current usage trends
  - [ ] Projected growth
  - [ ] Resource requirements

### 18. Quarterly Checks
- [ ] Full disaster recovery test
  - [ ] Test restore procedure
  - [ ] Verify RTO is met
  - [ ] Verify RPO is met

- [ ] Security audit
  - [ ] Review access logs
  - [ ] Check for unauthorized access
  - [ ] Update firewall rules if needed

- [ ] Performance optimization
  - [ ] Analyze bottlenecks
  - [ ] Optimize slow queries
  - [ ] Update caching strategies

## Rollback Plan

In case of critical issues:

### 1. Immediate Rollback
```bash
# Switch to previous version
docker service rollback whats-frontend

# Or using compose
docker compose down
git checkout <previous-tag>
docker compose up -d --build
```

### 2. Database Rollback
```bash
# Restore from backup
mysql < backup.sql

# Or for MongoDB
mongorestore --archive=backup.archive
```

### 3. Communication
- [ ] Notify stakeholders
- [ ] Update status page
- [ ] Document the issue
- [ ] Start postmortem analysis

## Sign-Off Checklist

Before going live:

- [ ] Project Manager approval
- [ ] Security team approval
- [ ] DevOps team approval
- [ ] QA sign-off
- [ ] Legal/Compliance approval
- [ ] Stakeholder approval

**Deployed by:** _________________
**Date:** _________________
**Version:** _________________
**Notes:** _________________

---

## Notes & Additional Items

### Items specific to this deployment:
- Arabic font testing completed ✅
- i18n configuration verified ✅
- Network access configuration done ✅

### Known Issues (if any):
(Document any known issues and workarounds)

### Maintenance Schedule:
- Daily checks: 8:00 AM
- Weekly reviews: Every Monday
- Monthly optimization: First Friday
- Quarterly DR test: Q1/Q2/Q3/Q4

---

**Last Updated:** [Deployment Date]
**Next Review:** [Next Review Date]
