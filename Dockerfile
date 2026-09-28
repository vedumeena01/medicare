# ───────────────────────────────────────────────────────────
# MediExplain AI Production Multi-Stage Container Engine
# ───────────────────────────────────────────────────────────

# ── Stage 1: Dependency Resolution ──
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Production Build & Asset Synthesis ──
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client & prepare SQLite Schema
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npm run build

# ── Stage 3: Minimal Production Runner ──
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create unprivileged system user for container security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone bundle
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dev.db ./dev.db
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Set user permissions
RUN chown -R nextjs:nodejs /app/data /app/dev.db

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
