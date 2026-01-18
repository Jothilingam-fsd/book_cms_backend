import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, '../data/db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {});

// Initialize database with default structure
const initDB = async () => {
  await db.read();
  
  db.data = db.data || {
    books: [],
    chapters: [],
    pages: [],
    versions: []
  };
  
  await db.write();
};

initDB();

export default db;

