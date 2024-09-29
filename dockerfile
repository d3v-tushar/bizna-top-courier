FROM node:20-alpine AS base

# Install git
RUN apk add --no-cache git \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Step 1. Clone the repository and install dependencies
FROM base AS builder
WORKDIR /app

# Clone the private repository
RUN git clone https://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@github.com/d3v-tushar/bizna-top-courier.git .

# Install dependencies based on the preferred package manager
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Warning: Lockfile not found." && yarn install; \
    fi

# Run database generation and migration before building
RUN yarn db:generate && yarn db:migrate

# Build Next.js
RUN yarn build

# Step 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]