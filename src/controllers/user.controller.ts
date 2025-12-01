// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { db } from '../database';
import sqlite3 from 'sqlite3';


// Type pour un utilisateur
type User = {
  id?: number;
  name: string;
  email: string;
};

// GET /users : récupérer tous les utilisateurs
export const getUsers = (req: Request, res: Response) => {
  db.all<User>('SELECT id, name, email FROM users', (err: Error | null, rows: User[]) => {
    if (err) {
      console.error('Erreur GET /users :', err.message);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.json(rows);
  });
};

// GET /users/:id : récupérer un utilisateur spécifique
export const getUserById = (req: Request, res: Response) => {
  const { id } = req.params;

  db.get<User>(
    'SELECT id, name, email FROM users WHERE id = ?',
    [id],
    (err: Error | null, row: User | undefined) => {
      if (err) {
        console.error('Erreur GET /users/:id :', err.message);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (!row) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json(row);
    }
  );
};

// POST /users : ajouter un utilisateur
export const addUser = (req: Request, res: Response) => {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name || !email) {
    return res.status(400).json({ message: 'Nom et email requis' });
  }

  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';

  db.run(
    query,
    [name, email],
    function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error('Erreur POST /users :', err.message);

        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        return res.status(500).json({ message: 'Erreur serveur' });
      }

      res.status(201).json({
        message: `Utilisateur ${name} ajouté avec succès !`,
        id: this.lastID,
        email,
      });
    }
  );
};

// PUT /users/:id : mettre à jour un utilisateur
export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name || !email) {
    return res.status(400).json({ message: 'Nom et email requis' });
  }

  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

  db.run(
    query,
    [name, email, id],
    function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error('Erreur PUT /users/:id :', err.message);

        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        message: `Utilisateur ${id} mis à jour avec succès`,
        id,
        name,
        email,
      });
    }
  );
};

// DELETE /users/:id : supprimer un utilisateur
export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  db.run(
    query,
    [id],
    function (this: sqlite3.RunResult, err: Error | null) {
      if (err) {
        console.error('Erreur DELETE /users/:id :', err.message);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({ message: `Utilisateur ${id} supprimé avec succès` });
    }
  );
};
