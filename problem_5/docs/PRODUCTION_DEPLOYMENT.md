# Production Deployment Guide

This guide covers deploying the CRUD Server application to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment Methods](#deployment-methods)
  - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
  - [Option 2: Docker Standalone](#option-2-docker-standalone)
  - [Option 3: Manual Deployment](#option-3-manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Security Considerations](#security-considerations)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Scaling & Performance](#scaling--performance)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Docker** (v20.10+) and **Docker Compose** (v2.0+) - For containerized deployment
- **OR** Node.js (v20+) and PostgreSQL (v16+) - For manual deployment
- **Git** - For cloning the repository

### Server Requirements

- **CPU:** Minimum 2 cores (4+ recommended for production)
- **RAM:** Minimum 2GB (4GB+ recommended)
- **Disk:** Minimum 20GB free space
- **Network:** Port 3000 (or configured port) accessible
- **OS:** Linux (Ubuntu 20.04+, CentOS 8+, or similar)

### Access Requirements

- SSH access to production server
- Root or sudo privileges
- Database access credentials
- Domain/DNS configuration (if using custom domain)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All tests pass: `npm test` or `npm run test:docker`
- [ ] Code is formatted: `npm run format:check`
- [ ] TypeScript compiles without errors: `npm run build`
- [ ] Environment variables are configured
- [ ] Database is set up and accessible
- [ ] API keys are generated and secure
- [ ] SSL/TLS certificates are ready (if using HTTPS)
- [ ] Firewall rules are configured
- [ ] Backup strategy is in place
- [ ] Monitoring is set up

---

## Deployment Methods

### Option 1: Docker Compose (Recommended)

**Best for:** Single server deployments, development-to-production parity, easy management.

#### Step 1: Prepare Server

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### Step 2: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd problem_5

# Checkout production branch/tag
git checkout main  # or your production branch
```

#### Step 3: Configure Environment

```bash
# Create production .env file
cat > .env << EOF
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=crud_db
DB_USER=postgres
DB_PASSWORD=<STRONG_PASSWORD_HERE>

# API Security
API_KEY=<GENERATE_STRONG_API_KEY>

# CORS (adjust for your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Optional: Swagger
SWAGGER_ENABLED=true
EOF

# Secure the .env file
chmod 600 .env
```

**Important:** Replace `<STRONG_PASSWORD_HERE>` and `<GENERATE_STRONG_API_KEY>` with secure values.

#### Step 4: Update docker-compose.yml for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: crud-postgres-prod
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER}']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - crud-network
    restart: unless-stopped
    # Remove port exposure for security (only internal access)
    # ports:
    #   - "5432:5432"

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: crud-server-prod
    environment:
      NODE_ENV: production
      PORT: ${PORT:-3000}
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      API_KEY: ${API_KEY}
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - '${PORT:-3000}:3000'
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - crud-network
    restart: unless-stopped
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

volumes:
  postgres_data:
    driver: local

networks:
  crud-network:
    driver: bridge
```

#### Step 5: Deploy

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app

# Check health
curl http://localhost:3000/health
```

#### Step 6: Initialize Database

```bash
# The database schema will be initialized automatically on first connection
# Verify by checking logs
docker-compose -f docker-compose.prod.yml logs app | grep "Database schema initialized"
```

#### Step 7: Set Up Reverse Proxy (Optional but Recommended)

**Using Nginx:**

```nginx
# /etc/nginx/sites-available/crud-server
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/crud-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Option 2: Docker Standalone

**Best for:** Cloud platforms, container orchestration (Kubernetes), CI/CD pipelines.

#### Build Docker Image

```bash
# Build production image
docker build -t crud-server:latest .

# Tag for registry
docker tag crud-server:latest your-registry/crud-server:v1.0.0

# Push to registry
docker push your-registry/crud-server:v1.0.0
```

#### Run Container

```bash
# Run with external database
docker run -d \
  --name crud-server \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=crud_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  -e API_KEY=your-api-key \
  --restart unless-stopped \
  crud-server:latest
```

---

### Option 3: Manual Deployment

**Best for:** Traditional server setups, full control over environment.

#### Step 1: Install Dependencies

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql-16 postgresql-contrib

# Verify installations
node --version
npm --version
psql --version
```

#### Step 2: Set Up Database

```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE crud_db;
CREATE USER crud_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE crud_db TO crud_user;
\q
EOF
```

#### Step 3: Clone and Build

```bash
# Clone repository
git clone <repository-url>
cd problem_5

# Install dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Verify build
ls -la dist/
```

#### Step 4: Configure Environment

```bash
# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crud_db
DB_USER=crud_user
DB_PASSWORD=strong_password_here
API_KEY=your-api-key-here
CORS_ORIGIN=https://yourdomain.com
EOF

chmod 600 .env
```

#### Step 5: Initialize Database Schema

```bash
# The schema will be initialized on first app start
# Or manually run initialization script if available
```

#### Step 6: Set Up Process Manager (PM2)

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start dist/index.js --name crud-server

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions shown

# Monitor
pm2 status
pm2 logs crud-server
```

#### Step 7: Set Up Nginx Reverse Proxy

See Nginx configuration in Option 1, Step 7.

---

## Environment Configuration

### Required Environment Variables

| Variable      | Description            | Example                   | Required |
| ------------- | ---------------------- | ------------------------- | -------- |
| `NODE_ENV`    | Environment mode       | `production`              | Yes      |
| `PORT`        | Server port            | `3000`                    | Yes      |
| `DB_HOST`     | Database host          | `postgres` or `localhost` | Yes      |
| `DB_PORT`     | Database port          | `5432`                    | Yes      |
| `DB_NAME`     | Database name          | `crud_db`                 | Yes      |
| `DB_USER`     | Database user          | `postgres`                | Yes      |
| `DB_PASSWORD` | Database password      | `secure_password`         | Yes      |
| `API_KEY`     | API authentication key | `your-api-key`            | Yes      |

### Optional Environment Variables

| Variable          | Description         | Example                  | Default |
| ----------------- | ------------------- | ------------------------ | ------- |
| `CORS_ORIGIN`     | Allowed CORS origin | `https://yourdomain.com` | `*`     |
| `SWAGGER_ENABLED` | Enable Swagger UI   | `true`                   | `false` |
| `LOG_LEVEL`       | Logging level       | `info`, `debug`, `error` | `info`  |

### Generating Secure API Key

```bash
# Generate a secure random API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment File Template

Create `.env.production`:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=crud_db
DB_USER=postgres
DB_PASSWORD=<CHANGE_THIS>

# Security
API_KEY=<GENERATE_SECURE_KEY>

# CORS
CORS_ORIGIN=https://yourdomain.com

# Features
SWAGGER_ENABLED=false
```

---

## Database Setup

### Initial Schema Creation

The database schema is automatically created when the application starts. The `initializeDatabase()` function in `src/config/database.ts` creates:

- `resources` table with indexes
- Proper constraints and defaults

### Manual Schema Creation (Optional)

If you need to create the schema manually:

```sql
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK(status IN ('active', 'inactive')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);
```

### Database Backup

```bash
# Backup database (Docker)
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres crud_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup database (Manual)
pg_dump -U crud_user -d crud_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U crud_user -d crud_db < backup_20240101_120000.sql
```

---

## Security Considerations

### 1. Environment Variables

- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique passwords
- ✅ Rotate API keys regularly
- ✅ Restrict file permissions: `chmod 600 .env`

### 2. Database Security

- ✅ Use strong database passwords
- ✅ Restrict database access (firewall rules)
- ✅ Don't expose database port publicly
- ✅ Use SSL/TLS for database connections in production

### 3. API Security

- ✅ Always use HTTPS in production
- ✅ Validate and sanitize all inputs
- ✅ Use API key authentication
- ✅ Implement rate limiting (consider adding)
- ✅ Keep dependencies updated

### 4. Server Security

- ✅ Keep system packages updated
- ✅ Configure firewall (UFW, iptables)
- ✅ Use SSH keys instead of passwords
- ✅ Disable root login
- ✅ Set up fail2ban for intrusion prevention

### 5. Docker Security

- ✅ Don't run containers as root
- ✅ Use specific image tags (not `latest`)
- ✅ Scan images for vulnerabilities
- ✅ Limit container resources
- ✅ Use secrets management for sensitive data

### Firewall Configuration

```bash
# UFW example
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Monitoring & Health Checks

### Health Check Endpoint

The application includes a health check endpoint:

```bash
# Check application health
curl http://localhost:3000/health

# Expected response
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Docker Health Checks

The Dockerfile includes a built-in health check that runs every 30 seconds.

### Monitoring Setup

#### Using PM2 (Manual Deployment)

```bash
# PM2 monitoring
pm2 monit

# PM2 web dashboard
pm2 web
```

#### Using Docker Stats

```bash
# Container resource usage
docker stats crud-server-prod
```

#### Log Monitoring

```bash
# Docker logs
docker-compose -f docker-compose.prod.yml logs -f app

# PM2 logs
pm2 logs crud-server

# System logs
journalctl -u your-service -f
```

### Recommended Monitoring Tools

- **Prometheus + Grafana** - Metrics and visualization
- **ELK Stack** - Log aggregation
- **New Relic / Datadog** - Application performance monitoring
- **Sentry** - Error tracking

---

## Scaling & Performance

### Horizontal Scaling

#### Using Docker Compose

```yaml
# Scale application instances
services:
  app:
    # ... configuration ...
    deploy:
      replicas: 3 # Run 3 instances
```

```bash
# Scale up
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

**Note:** You'll need a load balancer (Nginx, HAProxy) in front of multiple instances.

#### Load Balancer Configuration (Nginx)

```nginx
upstream crud_backend {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://crud_backend;
    }
}
```

### Database Connection Pooling

The application uses connection pooling (configured in `src/config/database.ts`):

- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds

### Performance Optimization

1. **Enable Gzip compression** (add to Express middleware)
2. **Use CDN** for static assets
3. **Implement caching** (Redis) for frequently accessed data
4. **Database indexing** (already configured)
5. **Query optimization** - Use EXPLAIN ANALYZE for slow queries

---

## Backup & Recovery

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="crud_db"
DB_USER="postgres"

# Create backup
docker-compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Make executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/backup.sh
```

### Recovery Procedure

```bash
# Stop application
docker-compose -f docker-compose.prod.yml stop app

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U postgres crud_db < backup_20240101_120000.sql

# Restart application
docker-compose -f docker-compose.prod.yml start app
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app
# or
pm2 logs crud-server

# Check environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep DB_

# Verify database connection
docker-compose -f docker-compose.prod.yml exec app \
  node -e "require('./dist/config/database').default.query('SELECT 1')"
```

### Database Connection Issues

```bash
# Test database connectivity
docker-compose -f docker-compose.prod.yml exec postgres \
  psql -U postgres -d crud_db -c "SELECT 1"

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Verify network
docker network inspect crud-network
```

### High Memory Usage

```bash
# Check container resources
docker stats crud-server-prod

# Check for memory leaks
docker-compose -f docker-compose.prod.yml exec app \
  node --expose-gc -e "global.gc(); console.log('GC triggered')"
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Container Keeps Restarting

```bash
# Check exit code
docker inspect crud-server-prod | grep -A 10 "State"

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs --tail=100 app
```

---

## Post-Deployment Verification

After deployment, verify:

1. **Health Check**

   ```bash
   curl http://your-domain/health
   ```

2. **API Endpoints**

   ```bash
   curl -H "X-API-Key: your-api-key" http://your-domain/api/resources
   ```

3. **Database Connection**
   - Check application logs for "Connected to PostgreSQL database"
   - Verify schema is initialized

4. **Swagger Documentation** (if enabled)

   ```bash
   curl http://your-domain/api-docs
   ```

5. **Error Handling**
   - Test invalid requests
   - Verify error responses are properly formatted

---

## Maintenance

### Updating Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (Docker)
docker-compose -f docker-compose.prod.yml up -d --build

# Or restart (PM2)
pm2 restart crud-server
```

### Updating Dependencies

```bash
# Update dependencies
npm update

# Test
npm test

# Rebuild
npm run build

# Deploy
# (follow deployment steps)
```

### Database Migrations

For future schema changes, create migration scripts and run them before deploying new code.

---

## Support & Resources

- **Application Logs:** Check logs for errors and debugging
- **Database Logs:** Check PostgreSQL logs for database issues
- **System Logs:** Check system logs for infrastructure issues
- **Documentation:** Refer to README.md for API documentation

---

## Quick Reference

### Start Production

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# PM2
pm2 start dist/index.js --name crud-server
```

### Stop Production

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml down

# PM2
pm2 stop crud-server
```

### View Logs

```bash
# Docker
docker-compose -f docker-compose.prod.yml logs -f app

# PM2
pm2 logs crud-server
```

### Restart

```bash
# Docker
docker-compose -f docker-compose.prod.yml restart app

# PM2
pm2 restart crud-server
```

---

**Last Updated:** 2024
**Version:** 1.0.0
