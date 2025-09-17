# Deployment Guide

## 🚀 Deployment Options

Codette can be deployed in multiple ways depending on your needs.

## 🌐 Frontend Deployment

### Netlify (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload the dist/ folder to Netlify
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
```bash
# Build with correct base path
npm run build -- --base=/codette/

# Deploy to gh-pages branch
npm run deploy
```

## 🐍 Backend Deployment

### Local Development
```bash
cd backend
pip install -r requirements.txt
python start.py
```

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker installed on your system
- Docker Compose installed on your system
- Git repository cloned locally

### Environment Setup

1. Create environment files:
```bash
# Frontend environment (.env)
cp .env.example .env

# Backend environment (backend/.env)
cp backend/.env.example backend/.env
```

2. Configure environment variables:
```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Backend (backend/.env)
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Container Build and Deploy

1. Build and start all services:
```bash
docker-compose up --build
```

2. Build and start specific services:
```bash
# Frontend only
docker-compose up --build frontend

# Backend only
docker-compose up --build backend
```

3. Run in detached mode:
```bash
docker-compose up -d
```

### Docker Configuration Details

#### Frontend Container
- Base image: Node 18
- Exposed port: 3000
- Build steps:
  1. Install dependencies
  2. Build the application
  3. Serve using Nginx

#### Backend Container
- Base image: Python 3.11
- Exposed port: 8000
- Features:
  1. FastAPI application server
  2. Async database connections
  3. WebSocket support
  4. Rate limiting

#### Nginx Configuration
The Nginx configuration (`deploy/nginx.conf`) handles:
- Reverse proxy to backend
- Static file serving
- CORS headers
- Security headers
- WebSocket upgrades

### Container Management

1. View logs:
```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f frontend
docker-compose logs -f backend
```

2. Container health check:
```bash
docker-compose ps
```

3. Stop containers:
```bash
docker-compose down
```

4. Clean up:
```bash
# Remove containers and networks
docker-compose down

# Also remove volumes
docker-compose down -v

# Remove all unused images
docker system prune
```

### Production Deployment

For production deployment, use the production Docker Compose file:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Production configuration includes:
- SSL termination
- Optimized Nginx config
- Production-ready environment variables
- Health checks
- Resource limits
- Automatic restarts
- Volume persistence

### Troubleshooting

1. Container fails to start:
   - Check logs: `docker-compose logs <service-name>`
   - Verify environment variables
   - Ensure ports are available

2. Connection issues:
   - Check network configuration
   - Verify firewall settings
   - Ensure services are running: `docker-compose ps`

3. Performance issues:
   - Monitor resources: `docker stats`
   - Check container logs for bottlenecks
   - Review volume mounts and network settings

### Cloud Deployment

#### Heroku
```bash
# Create Procfile
echo "web: python backend/start.py" > Procfile

# Deploy
git push heroku main
```

#### AWS Lambda
```bash
# Install serverless
npm install -g serverless

# Deploy
serverless deploy
```

## 🗄️ Database Setup

### Supabase (Recommended)
1. Create a Supabase project
2. Run the migration files in `supabase/migrations/`
3. Set environment variables:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### PostgreSQL
```sql
-- Create database
CREATE DATABASE codette;

-- Run migrations
\i supabase/migrations/create_tables.sql
```

## ⚙️ Environment Configuration

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_BACKEND_URL=https://your-backend.herokuapp.com
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/codette
OPENAI_API_KEY=your_openai_key
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8000
```

## 🔒 Security Configuration

### SSL/TLS
- Always use HTTPS in production
- Configure proper SSL certificates
- Enable HSTS headers

### CORS
```python
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-domain.com
```

### API Keys
- Store API keys securely
- Use environment variables
- Rotate keys regularly
- Monitor usage

## 📊 Monitoring & Analytics

### Health Checks
```bash
# Frontend health
curl https://your-app.netlify.app/

# Backend health
curl https://your-api.herokuapp.com/health
```

### Logging
- Configure structured logging
- Monitor error rates
- Set up alerts for critical issues
- Track performance metrics

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy Codette

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: python backend/test_backend.py
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-codette-backend"
          heroku_email: "your-email@example.com"
```

## 🎯 Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Optimize images and fonts
- Enable service worker caching

### Backend
- Use connection pooling
- Implement Redis caching
- Optimize database queries
- Use async/await properly
- Monitor memory usage

## 🧪 Testing in Production

### Smoke Tests
```bash
# Test critical paths
curl -f https://your-app.com/api/health
curl -f https://your-app.com/api/quantum/optimize -X POST -d '{"objectives":["test"]}'
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load tests
artillery run load-test.yml
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Deploy multiple backend instances
- Implement database read replicas
- Use microservices architecture

### Vertical Scaling
- Monitor resource usage
- Upgrade server specifications
- Optimize memory allocation
- Use faster storage

## 🚨 Disaster Recovery

### Backup Strategy
- Daily database backups
- Code repository backups
- Configuration backups
- Regular restore testing

### Rollback Plan
- Keep previous deployment artifacts
- Implement blue-green deployment
- Use feature flags for quick rollbacks
- Monitor deployment health

## 📞 Support & Maintenance

### Monitoring
- Set up uptime monitoring
- Configure error tracking
- Monitor performance metrics
- Track user analytics

### Updates
- Regular dependency updates
- Security patch management
- Feature rollout planning
- User communication

---

## 🔗 Quick Links

- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Security Guide](../SECURITY.md)
- [API Documentation](./API.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

**Need help with deployment? Contact us at deployment@raiffsbits.com**