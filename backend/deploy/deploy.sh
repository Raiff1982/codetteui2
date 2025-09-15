#!/bin/bash

# Codette Backend Deployment Script
# Supports multiple deployment targets

set -e

echo "🚀 Codette Backend Deployment Script"
echo "======================================"

# Configuration
DEPLOYMENT_TYPE=${1:-"local"}
ENVIRONMENT=${2:-"production"}
VERSION=$(date +%Y%m%d-%H%M%S)

echo "📋 Deployment Configuration:"
echo "   Type: $DEPLOYMENT_TYPE"
echo "   Environment: $ENVIRONMENT"
echo "   Version: $VERSION"
echo ""

# Functions
deploy_local() {
    echo "🏠 Deploying locally with Docker Compose..."
    
    # Build and start services
    docker-compose -f deploy/docker-compose.yml build
    docker-compose -f deploy/docker-compose.yml up -d
    
    echo "✅ Local deployment complete!"
    echo "🌐 Backend: http://localhost:8000"
    echo "🎨 Frontend: http://localhost:3000"
    echo "📊 Health: http://localhost:8000/api/health"
}

deploy_heroku() {
    echo "☁️ Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found. Please install it first."
        exit 1
    fi
    
    # Create Procfile for Heroku
    cat > Procfile << EOF
web: python start.py
EOF
    
    # Deploy to Heroku
    git add .
    git commit -m "Deploy Codette Backend v$VERSION" || true
    heroku create codette-backend-$VERSION || true
    git push heroku main
    
    echo "✅ Heroku deployment complete!"
    heroku open
}

deploy_aws() {
    echo "☁️ Deploying to AWS..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        echo "❌ AWS CLI not found. Please install it first."
        exit 1
    fi
    
    # Build Docker image
    docker build -f deploy/Dockerfile -t codette-backend:$VERSION .
    
    # Tag for ECR (replace with your ECR repository)
    # docker tag codette-backend:$VERSION your-account.dkr.ecr.region.amazonaws.com/codette-backend:$VERSION
    
    echo "✅ AWS deployment prepared!"
    echo "📝 Next steps:"
    echo "   1. Push image to ECR"
    echo "   2. Update ECS service"
    echo "   3. Configure load balancer"
}

deploy_digital_ocean() {
    echo "☁️ Deploying to Digital Ocean..."
    
    # Check if doctl is installed
    if ! command -v doctl &> /dev/null; then
        echo "❌ Digital Ocean CLI not found. Please install doctl first."
        exit 1
    fi
    
    # Build and push to Digital Ocean Container Registry
    docker build -f deploy/Dockerfile -t codette-backend:$VERSION .
    
    echo "✅ Digital Ocean deployment prepared!"
    echo "📝 Next steps:"
    echo "   1. Push to DO Container Registry"
    echo "   2. Deploy to App Platform"
}

# Health check function
health_check() {
    echo "🏥 Running health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:8000/api/health > /dev/null 2>&1; then
            echo "✅ Backend is healthy!"
            return 0
        fi
        
        echo "⏳ Waiting for backend to start (attempt $attempt/$max_attempts)..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Health check failed after $max_attempts attempts"
    return 1
}

# Pre-deployment checks
pre_deploy_checks() {
    echo "🔍 Running pre-deployment checks..."
    
    # Check if required files exist
    required_files=(
        "main.py"
        "requirements.txt"
        "start.py"
        ".env.example"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "❌ Required file missing: $file"
            exit 1
        fi
    done
    
    # Check Python dependencies
    if [ -f "requirements.txt" ]; then
        echo "📦 Checking Python dependencies..."
        pip check || echo "⚠️ Some dependency issues found"
    fi
    
    echo "✅ Pre-deployment checks passed!"
}

# Main deployment logic
main() {
    echo "🚀 Starting Codette Backend Deployment..."
    
    # Run pre-deployment checks
    pre_deploy_checks
    
    case $DEPLOYMENT_TYPE in
        "local")
            deploy_local
            health_check
            ;;
        "heroku")
            deploy_heroku
            ;;
        "aws")
            deploy_aws
            ;;
        "digitalocean"|"do")
            deploy_digital_ocean
            ;;
        *)
            echo "❌ Unknown deployment type: $DEPLOYMENT_TYPE"
            echo "📝 Supported types: local, heroku, aws, digitalocean"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "📊 Monitor logs: docker-compose logs -f (for local)"
    echo "🔧 Manage: docker-compose down (to stop local)"
}

# Run main function
main "$@"