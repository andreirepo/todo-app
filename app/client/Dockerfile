# Stage 1: Build application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first
COPY package.json ./
COPY yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Build step
RUN yarn build

# Stage 2: Production runtime
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
