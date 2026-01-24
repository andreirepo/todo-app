# ---------- Builder ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Enable Corepack
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 👇 COPY ENTIRE MONOREPO STRUCTURE FIRST
COPY package.json yarn.lock .yarnrc.yml ./
COPY app/ app/

# 👇 NOW install — Yarn will detect workspaces
RUN yarn install --inline-builds

# Build server
RUN yarn workspace server run build


# ---------- Runtime ----------
FROM node:18-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# Copy root files
COPY package.json yarn.lock .yarnrc.yml ./
COPY app/server/package.json app/server/package.json

# Install only server prod deps
RUN yarn workspaces focus server --production

# Copy built code
COPY --from=builder /app/app/server/dist app/server/dist

WORKDIR /app/app/server

CMD ["node", "dist/server.js"]