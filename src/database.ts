import sqlite3 from 'sqlite3';
import path from 'path';

// Active quelques logs utiles pour le debug
sqlite3.verbose();

// On stocke la base dans un fichier users.db à côté du code compilé
const dbPath = path.resolve(__dirname, 'users.db');

// Ouverture / création de la base
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à SQLite :', err.message);
  } else {
    console.log('Base SQLite initialisée :', dbPath);
  }
});

// Création de la table users
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )`,
    (err) => {
      if (err) {
        console.error('Erreur lors de la création de la table users :', err.message);
      } else {
        console.log('Table users prête');
      }
    }
  );
});
