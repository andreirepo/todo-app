# Stage 1: Build application
FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.8.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
COPY app/ app/

ARG API_URL=/api
ARG BASE_URL=/
ARG NODE_ENV=production
ENV API_URL=$API_URL
ENV BASE_URL=$BASE_URL
ENV NODE_ENV=$NODE_ENV

RUN yarn install

WORKDIR /app/app/client
RUN yarn build


# Stage 2: Production runtime
FROM nginx:1.25-alpine

COPY --from=builder /app/app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]