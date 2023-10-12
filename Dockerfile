FROM node:19-alpine

WORKDIR /app

COPY . .
COPY ./prisma ./prisma

RUN npx prisma generate

RUN npm i -g pnpm

COPY package.json package.json

COPY pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm install

CMD ["pnpm", "start:dev"]