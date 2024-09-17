import { defineConfig, type Config } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/database/schema/index.ts',
  // out: './src/lib/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
}) satisfies Config;
