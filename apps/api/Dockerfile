# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN npm install -g pnpm@11.19.0
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @belfed/db generate
RUN pnpm --filter @belfed/db build
RUN pnpm --filter api build
RUN pnpm --filter api --prod deploy /app/pruned

FROM builder AS migrator
CMD ["pnpm", "--filter", "@belfed/db", "migrate:deploy"]

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/pruned .
CMD ["node", "dist/index.js"]
