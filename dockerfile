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

# ARG for GitHub Personal Access Token
# ARG GITHUB_PAT
# ARG GITHUB_REPO

# Clone the private repository
# RUN git clone https://${GITHUB_PAT}@github.com/${GITHUB_REPO}.git .
RUN git clone https://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@github.com/d3v-tushar/bizna-top-courier.git .

# Install dependencies based on the preferred package manager
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Warning: Lockfile not found." && yarn install; \
    fi

# Environment variables must be present at build time
# We're using ARG to pass these during build time
ARG NODE_ENV
ARG NEXT_RUNTIME
ARG DOMAIN
ARG SESSION_SECRET
ARG DATABASE_URL
ARG S3_REGION
ARG S3_ENDPOINT
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_BUCKET_NAME
ARG S3_ENDPOINT_EU
ARG S3_HOSTNAME
ARG WEB_PUSH_EMAIL
ARG NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
ARG WEB_PUSH_PRIVATE_KEY

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_RUNTIME=${NEXT_RUNTIME}
ENV DOMAIN=${DOMAIN}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV S3_REGION=${S3_REGION}
ENV S3_ENDPOINT=${S3_ENDPOINT}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV S3_ENDPOINT_EU=${S3_ENDPOINT_EU}
ENV S3_HOSTNAME=${S3_HOSTNAME}
ENV WEB_PUSH_EMAIL=${WEB_PUSH_EMAIL}
ENV NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=${NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY}
ENV WEB_PUSH_PRIVATE_KEY=${WEB_PUSH_PRIVATE_KEY}

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

# Environment variables must be redefined at run time
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_RUNTIME=${NEXT_RUNTIME}
ENV DOMAIN=${DOMAIN}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV S3_REGION=${S3_REGION}
ENV S3_ENDPOINT=${S3_ENDPOINT}
ENV S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
ENV S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV S3_ENDPOINT_EU=${S3_ENDPOINT_EU}
ENV S3_HOSTNAME=${S3_HOSTNAME}
ENV WEB_PUSH_EMAIL=${WEB_PUSH_EMAIL}
ENV NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY=${NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY}
ENV WEB_PUSH_PRIVATE_KEY=${WEB_PUSH_PRIVATE_KEY}

CMD ["node", "server.js"]