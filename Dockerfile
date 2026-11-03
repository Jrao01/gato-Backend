FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

COPY ./.env .env

EXPOSE 3000

CMD ["node", "dist/server.js"]