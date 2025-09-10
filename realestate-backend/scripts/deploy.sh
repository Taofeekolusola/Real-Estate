#!/bin/bash

# Deployment script for Real Estate Backend
set -e

echo "🚀 Starting deployment process..."

# Check if required environment variables are set
if [ -z "$NODE_ENV" ]; then
    echo "❌ NODE_ENV is not set"
    exit 1
fi

if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI is not set"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run tests
echo "🧪 Running tests..."
npm test

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t realestate-backend:latest .

# Run security scan
echo "🔒 Running security scan..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image realestate-backend:latest

# Deploy based on environment
if [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Deploying to production..."
    docker-compose -f docker-compose.prod.yml up -d
else
    echo "🧪 Deploying to staging..."
    docker-compose up -d
fi

echo "✅ Deployment completed successfully!"

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost:5000/health || {
    echo "❌ Health check failed"
    exit 1
}

echo "🎉 Deployment and health check completed successfully!"
