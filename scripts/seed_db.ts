import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

const main = async () => {
  const databaseDir = resolve(process.cwd(), 'database');
  const dbPath = join(databaseDir, 'db.sqlite');
  const seedPath = join(databaseDir, 'seed.sql');

  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  const sql = readFileSync(seedPath, 'utf-8');
  await db.exec(sql);
  await db.close();
  console.log('DB seeded successfully at ', dbPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
