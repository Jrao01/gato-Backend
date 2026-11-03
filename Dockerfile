FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

# Copy .env from project root (parent of apps/api)
COPY ../.env .env

EXPOSE 3000

CMD ["node", "dist/server.js"]