FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.8.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable  # ← Add --immutable for reproducibility

COPY app/ app/
COPY .env* ./

WORKDIR /app/app/client
RUN yarn build

FROM nginx:1.25-alpine
COPY --from=builder /app/app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]