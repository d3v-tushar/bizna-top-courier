# Base image for Node.js
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS builder

# Install dependencies for node-canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Set working directory inside the container
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi

# Copy all necessary files for the build process
COPY src ./src
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .
COPY drizzle.config.ts .

# Set environment variables required at build time
ENV NODE_ENV=production
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG SESSION_SECRET
ENV SESSION_SECRET=${SESSION_SECRET}
ARG DOMAIN
ENV DOMAIN=${DOMAIN}
ARG S3_REGION
ENV S3_REGION=${S3_REGION}
ARG S3_ENDPOINT
ENV S3_ENDPOINT=${S3_ENDPOINT}
ARG S3_ACCESS_KEY_ID
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ARG S3_SECRET_ACCESS_KEY
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ARG S3_BUCKET_NAME
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ARG S3_ENDPOINT_EU
ENV S3_ENDPOINT_EU=${S3_ENDPOINT_EU}
ARG S3_HOSTNAME
ENV S3_HOSTNAME=${S3_HOSTNAME}
ARG NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
ENV NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=${NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY}
ARG WEB_PUSH_PRIVATE_KEY
ENV WEB_PUSH_PRIVATE_KEY=${WEB_PUSH_PRIVATE_KEY}
ARG WEB_PUSH_EMAIL
ENV WEB_PUSH_EMAIL=${WEB_PUSH_EMAIL}

# # Run Drizzle ORM commands
RUN yarn db:generate && yarn db:migrate

# Build the Next.js app
RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then pnpm build; \
    else npm run build; \
    fi

# Production image, copy artifacts from builder
FROM base AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

# Copy built assets and necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Reapply environment variables for runtime
ENV NODE_ENV=production
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG SESSION_SECRET
ENV SESSION_SECRET=${SESSION_SECRET}
ARG DOMAIN
ENV DOMAIN=${DOMAIN}
ARG S3_REGION
ENV S3_REGION=${S3_REGION}
ARG S3_ENDPOINT
ENV S3_ENDPOINT=${S3_ENDPOINT}
ARG S3_ACCESS_KEY_ID
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ARG S3_SECRET_ACCESS_KEY
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ARG S3_BUCKET_NAME
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ARG S3_ENDPOINT_EU
ENV S3_ENDPOINT_EU=${S3_ENDPOINT_EU}
ARG S3_HOSTNAME
ENV S3_HOSTNAME=${S3_HOSTNAME}
ARG NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
ENV NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=${NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY}
ARG WEB_PUSH_PRIVATE_KEY
ENV WEB_PUSH_PRIVATE_KEY=${WEB_PUSH_PRIVATE_KEY}
ARG WEB_PUSH_EMAIL
ENV WEB_PUSH_EMAIL=${WEB_PUSH_EMAIL}

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Start Next.js server
CMD ["node", "server.js"]
#CMD ["sh", "-c", "./wait-for-it.sh biznatop-db:5432 -- node server.js"]