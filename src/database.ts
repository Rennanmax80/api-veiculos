import sqlite3 from 'sqlite3';
import path from 'path';

const db = new sqlite3.Database(path.resolve(__dirname, '../veiculos.db'));

function initDb(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        veiculo TEXT NOT NULL,
        marca TEXT NOT NULL,
        ano INTEGER NOT NULL,
        descricao TEXT,
        vendido BOOLEAN NOT NULL DEFAULT 0,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      err => (err ? reject(err) : resolve())
    );
  });
}

export { db, initDb };
