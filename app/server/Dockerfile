# ---------- Builder ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Enable Corepack and install Yarn 4
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# Copy monorepo root files (no .yarn/)
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies (Yarn will auto-download its binary)
RUN yarn install --inline-builds

# Copy server source code
COPY app/server app/server

# Build server
RUN yarn workspace server run build


# ---------- Runtime ----------
FROM node:18-alpine AS runtime

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Enable Corepack again in runtime (for consistency)
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# Copy root files
COPY package.json yarn.lock .yarnrc.yml ./

# Copy server package.json
COPY app/server/package.json app/server/package.json

# Install only production dependencies for the server workspace
RUN yarn workspaces focus server --production

# Copy built server code
COPY --from=builder /app/app/server/dist app/server/dist

WORKDIR /app/app/server

CMD ["node", "dist/server.js"]