# Stage 1: Build application
FROM node:18-alpine AS builder

# Environment variables must come after FROM
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app

# Copy package files including tsconfig and yarn.lock
COPY package.json tsconfig.json yarn.lock ./

# Install ALL dependencies including devDependencies
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Add timeout to prevent hanging
RUN yarn install --network-timeout 600000 --network-concurrency 1

# Copy source files BEFORE build
COPY src ./src
COPY routes ./routes
COPY models ./models

# Build step with explicit config
RUN yarn tsc --project tsconfig.json --noEmit false --skipLibCheck true

# Add explicit copy of compiled files
RUN mkdir -p dist && cp -R src/* dist/

# Stage 2: Production runtime
FROM node:18-alpine
WORKDIR /app

# Update package installation to use latest available versions
RUN apk add --no-cache mongodb-tools curl

# Copy production package files FROM BUILDER
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install PRODUCTION dependencies only
RUN yarn install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Update package installation to use latest available versions
RUN apk add --no-cache curl

# Create startup script with proper path verification
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Checking server file..."' >> /app/start.sh && \
    echo 'ls -la /app/dist/src/ || echo "Directory listing failed"' >> /app/start.sh && \
    echo 'if [ ! -f /app/dist/src/server.js ]; then' >> /app/start.sh && \
    echo '  echo "Server file missing!"' >> /app/start.sh && \
    echo '  exit 1' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Checking MongoDB connectivity..."' >> /app/start.sh && \
    echo 'for i in $(seq 1 30); do' >> /app/start.sh && \
    echo '  if curl -s http://todo-db:27017 > /dev/null; then' >> /app/start.sh && \
    echo '    echo "MongoDB is reachable!"' >> /app/start.sh && \
    echo '    break' >> /app/start.sh && \
    echo '  fi' >> /app/start.sh && \
    echo '  echo "Waiting for MongoDB to be reachable (attempt $i/30)..."' >> /app/start.sh && \
    echo '  sleep 3' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "Starting Node.js server..."' >> /app/start.sh && \
    echo 'export MONGO_URI="mongodb://admin:dUO5Ob1cB1hfMvnw@todo-db:27017/todos?authSource=admin"' >> /app/start.sh && \
    echo 'exec node --trace-warnings dist/src/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Security setup
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
    
USER appuser

# Runtime configuration
ENV NODE_ENV=production \
    PORT=5000 \
    MONGO_URI=mongodb://admin:dUO5Ob1cB1hfMvnw@todo-db:27017/todos?authSource=admin&directConnection=true \
    CORS_ORIGIN=http://localhost:3000

EXPOSE 5000

# Update healthcheck parameters
HEALTHCHECK --interval=15s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:5000/health || exit 1

# Use the startup script instead of direct node command
CMD ["/app/start.sh"]
