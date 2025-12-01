import { Router } from 'express';
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

// POST /users : ajouter un utilisateur
router.post('/', addUser);

// GET /users : récupérer tous les utilisateurs
router.get('/', getUsers);

// GET /users/:id : récupérer un utilisateur par son id
router.get('/:id', getUserById);

// PUT /users/:id : mettre à jour un utilisateur
router.put('/:id', updateUser);

// DELETE /users/:id : supprimer un utilisateur
router.delete('/:id', deleteUser);

export default router;
