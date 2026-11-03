FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY apps/api/package.json ./
RUN npm install --include-dev

COPY apps/api/tsconfig.json ./
COPY apps/api/src ./src

RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist

COPY ./.env .env

EXPOSE 3000

CMD ["node", "dist/server.js"]