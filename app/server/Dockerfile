    # ---------- Builder ----------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Enable Corepack and activate Yarn 4
    RUN corepack enable && corepack prepare yarn@4.7.0 --activate
    
    # Copy monorepo root files
    COPY package.json yarn.lock .yarnrc.yml ./
    COPY .yarn/ .yarn/
    COPY app app
    
    # Install dependencies for all workspaces
    RUN yarn install --inline-builds
    
    # Copy server workspace code
    COPY app/server app/server
    
    # Build only the server workspace
    RUN yarn workspace server run build
    
    # ---------- Runtime ----------
    FROM node:18-alpine AS runtime
    
    WORKDIR /app

    RUN apk add --no-cache curl
    
    RUN corepack enable && corepack prepare yarn@4.7.0 --activate
    
    # Copy only what's needed for production
    COPY package.json yarn.lock .yarnrc.yml ./
    COPY .yarn/ .yarn/
    COPY app/server/package.json app/server/package.json
    
    # Install just the server workspace in prod mode
    RUN yarn workspaces focus server --production
    
    # Copy build output
    COPY --from=builder /app/app/server/dist app/server/dist
    
    WORKDIR /app/app/server
    
    CMD ["node", "dist/server.js"]
    