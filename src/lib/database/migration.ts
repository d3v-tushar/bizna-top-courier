import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import db, { pool as connection } from '.';

async function migration() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './drizzle' });

  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}
