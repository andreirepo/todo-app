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

# Wait for SSL certificate issuance (optional but recommended for HTTPS)
if [ -d "./acme" ]; then
  echo "⏳ Waiting for SSL certificate issuance (up to 60 seconds)..."
  timeout=12
  count=0
  while [ ! -s "./acme/acme.json" ] && [ $count -lt $timeout ]; do
    sleep 5
    count=$((count + 1))
    echo "⏳ Still waiting for certificate... ($((count * 5))s elapsed)"
  done
  
  if [ -s "./acme/acme.json" ]; then
    echo "✅ SSL certificate obtained!"
  else
    echo "⚠️  SSL certificate not ready yet (continuing anyway)"
  fi
else
  echo "⏳ Waiting for services to start..."
  sleep 15
fi

# Check if containers are running
echo "📋 Checking container status..."
if ! docker-compose ps | grep -q "Up"; then
  echo "❌ Some containers failed to start!"
  docker-compose logs --tail=10
  exit 1
fi

# Health check for frontend (via Traefik)
echo "📋 Checking frontend health..."
for i in {1..5}; do
  # Check HTTP → should redirect to HTTPS (301/302) OR get 200 if direct IP access
  if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -qE "(200|301|302)"; then
    echo "✅ Frontend is responding!"
    break
  elif [ $i -eq 5 ]; then
    echo "❌ Frontend not responding after 5 attempts"
    exit 1
  else
    echo "⏳ Frontend not ready, retrying... ($i/5)"
    sleep 3
  fi
done

# Health check for backend (via Traefik API route)
echo "📋 Checking backend health..."
for i in {1..5}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health | grep -q 200; then
    echo "✅ Backend is healthy!"
    break
  elif [ $i -eq 5 ]; then
    echo "❌ Backend health check failed after 5 attempts"
    exit 1
  else
    echo "⏳ Backend not ready, retrying... ($i/5)"
    sleep 3
  fi
done

# Optional: Test with your actual domain (if configured)
if command -v host &> /dev/null; then
  DOMAIN="todo.andreiqa.click"
  if host "$DOMAIN" &> /dev/null; then
    echo "🌐 Testing with domain: $DOMAIN"
    if curl -k -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" | grep -q 200; then
      echo "✅ Domain-based API health check passed!"
    else
      echo "⚠️  Domain health check failed (might be DNS propagation delay)"
    fi
  fi
fi

echo ""
echo "🎉 Deployment complete!"
echo "🌐 Access your app at: http://localhost"
echo "   (Will auto-redirect to HTTPS if domain is configured)"
echo "🔧 API endpoints: /api/*"
echo "📊 Traefik dashboard: http://localhost/traefik"

# Show certificate info if available
if [ -s "./acme/acme.json" ]; then
  echo "🔒 SSL certificates stored in ./acme/acme.json"
fi