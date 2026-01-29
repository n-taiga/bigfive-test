# Multi-stage build for Next.js app using pnpm

# 1) Install dependencies
FROM node:20-alpine AS deps
RUN corepack enable
ENV CI=true
WORKDIR /app
# Copy monorepo sources so local file: dependencies resolve
COPY packages ./packages
COPY web ./web
WORKDIR /app/web
RUN pnpm install --frozen-lockfile

# 2) Build the app
FROM node:20-alpine AS builder
RUN corepack enable
ENV CI=true
WORKDIR /app/web
COPY --from=deps /app/packages ../packages
COPY --from=deps /app/web .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# 3) Runtime image
FROM node:20-alpine AS runner
RUN corepack enable
WORKDIR /app/web
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

# Copy build artifacts and runtime deps
COPY --from=builder /app/web/.next ./.next
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/package.json ./package.json
COPY --from=builder /app/web/node_modules ./node_modules
# Include local packages in case runtime code references them
COPY --from=builder /app/packages ../packages

CMD ["pnpm", "start"]
