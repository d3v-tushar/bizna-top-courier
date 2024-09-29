#!/bin/sh

# Install dependencies
echo "Installing dependencies"
yarn install

# Generate migration schemas
echo "Generating migration schemas"
yarn db:generate

# Run migrations
echo "Running migrations"
yarn db:migrate

# Build the Next.JS application
echo "Building Next.JS application"
yarn build

# Start the Next.JS application
echo "Starting Next.JS application"
yarn start