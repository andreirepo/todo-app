#!/bin/bash

set -e

echo "🚀 Starting Docker deployment..."
echo "ℹ️  Note: For serverless deployment, use: ./deploy-enhanced.sh serverless"
echo "ℹ️  For help: ./deploy-enhanced.sh help"
echo ""

# Load env vars from .env manually if needed
if [ -f .env ]; then
  echo "📦 Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi

# Optional: Stop any previous containers
echo "🧹 Stopping old containers..."
docker-compose down

# Build everything
echo "🔨 Building full stack..."
docker-compose build

# Start services
echo "📦 Bringing up services..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
echo "📋 Checking container status..."
if ! docker-compose ps | grep -q "Up"; then
  echo "❌ Some containers failed to start!"
  docker-compose logs --tail=10
  exit 1
fi

# Health check for frontend
echo "📋 Checking frontend health..."
for i in {1..5}; do
  if curl -s -o /dev/null -w "%{http_code}\n" http://localhost:80 | grep -q 200; then
    echo "✅ Frontend is up!"
    break
  elif [ $i -eq 5 ]; then
    echo "❌ Frontend not responding after 5 attempts"
  else
    echo "⏳ Frontend not ready, retrying... ($i/5)"
    sleep 3
  fi
done

# Health check for backend (direct port)
echo "📋 Checking backend health..."
for i in {1..5}; do
  if curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/health | grep -q 200; then
    echo "✅ Backend is healthy!"
    break
  elif [ $i -eq 5 ]; then
    echo "❌ Backend health check failed after 5 attempts"
  else
    echo "⏳ Backend not ready, retrying... ($i/5)"
    sleep 3
  fi
done

echo ""
echo "🎉 Deployment complete!"
echo "📱 Frontend: http://localhost:80"
echo "🔧 Backend API: http://localhost:80/api"
echo "🏥 Backend Health: http://localhost:5000/health"
