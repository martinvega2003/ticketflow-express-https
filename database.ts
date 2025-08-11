import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { join } from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  const dbFile = join(process.cwd(), 'database', 'db.sqlite');
  dbInstance = await open({ filename: dbFile, driver: sqlite3.Database });
  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  return dbInstance;
} 
