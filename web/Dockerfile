# Multi-stage build for Next.js app using pnpm

# 1) Build local packages and prepare web app
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN corepack enable
ENV CI=true
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Convert Windows line endings (CRLF) to Linux (LF)
# This prevents YAML/Webpack errors caused by \r characters on Windows hosts
RUN find . -type f \( -name "*.md" -o -name "*.yaml" -o -name "*.yml" -o -name "*.ts" -o -name "*.tsx" -o -name "package.json" \) -exec sed -i 's/\r$//' {} +

# Build local packages
RUN cd packages/questions && pnpm install && pnpm build \
 && cd ../results && pnpm install && pnpm build \
 && cd ../score && pnpm install && pnpm build

# Build the web app
WORKDIR /app/web
RUN pnpm install --frozen-lockfile \
	&& pnpm approve-builds contentlayer esbuild protobufjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV DB_URL=mongodb://localhost:27017/dummy
RUN pnpm build

# 2) Runtime image
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN corepack enable
WORKDIR /app/web

# ===== UID/GID =====
ARG USERNAME=appuser
ARG UID=1001
ARG GID=1001
RUN addgroup -g $GID $USERNAME \
	&& adduser -D -u $UID -G $USERNAME $USERNAME \
	&& chown -R $UID:$GID /app
USER $USERNAME

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

# results dir
RUN mkdir -p /app/web/results \
 && chown -R $USERNAME:$USERNAME /app

# Copy build artifacts
COPY --from=builder /app/web/.next ./.next
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/package.json ./package.json
COPY --from=builder /app/web/node_modules ./node_modules
COPY --from=builder /app/packages ../packages

CMD ["pnpm", "start"]
