#!/bin/bash

set -e

echo "🚀 Starting deployment..."

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

# Wait a few seconds for containers to spin up
sleep 5

# Health check for frontend
echo "📋 Checking frontend health..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:80 | grep 200 > /dev/null \
  && echo "✅ Frontend is up!" || echo "❌ Frontend not responding"

# Health check for backend
echo "📋 Checking backend health..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:80/health | grep 200 > /dev/null \
  && echo "✅ Backend is healthy!" || echo "❌ Backend health check failed"

# Optional: Enable Tailscale Funnel
read -p "🌐 Enable Tailscale Funnel (public access via HTTPS)? (y/N): " enable_funnel
if [[ "$enable_funnel" == "y" || "$enable_funnel" == "Y" ]]; then
  echo "🔗 Enabling Tailscale Funnel..."
  sudo tailscale serve reset
  sudo tailscale serve --bg http://localhost:80
  echo "✅ Tailscale public URL:"
  tailscale status | grep "$(hostname)"
else
  echo "🛑 Skipping Funnel setup."
fi

echo "🎉 Deployment complete!"
