# Stage 1: Build application
FROM node:18-alpine AS builder
WORKDIR /app

# Enable Yarn 4
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# Copy monorepo files
COPY package.json yarn.lock .yarn .yarnrc.yml ./

# Copy the client workspace only
COPY app/client ./app/client

WORKDIR /app/app/client

# Install dependencies
RUN yarn install --immutable

# Set variables
ARG API_URL
ENV API_URL=$API_URL
ENV PATH="./node_modules/.bin:$PATH"

# Build step
RUN yarn build

# Stage 2: Production runtime
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY app/client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
