# Stage 1: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Enable Yarn 4
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# Copy monorepo root files (NO .yarn/)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .env* ./

# Copy entire app directory (so Yarn sees workspace structure)
COPY app/ app/

# Install dependencies (Yarn auto-downloads its binary)
RUN yarn install

# Build client
WORKDIR /app/app/client
RUN yarn build


# Stage 2: Production runtime
FROM nginx:1.25-alpine

# Copy built files
COPY --from=builder /app/app/client/dist /usr/share/nginx/html

# Copy NGINX config
COPY app/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]