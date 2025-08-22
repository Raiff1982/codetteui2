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

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "start.py"]
```

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