FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "cd /app/server && pnpm prisma generate && pnpm prisma migrate deploy && pnpm run build && pnpm run start:dev"]
