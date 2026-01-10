import express from 'express';
import { authenticateToken, authorizeRole, logAction } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios (solo admin)
router.get('/', authorizeRole('admin'), userController.getUsers);

// Obtener usuario por ID (solo admin o el mismo usuario)
router.get('/:id', userController.getUser);

// Crear nuevo usuario (solo admin)
router.post('/', authorizeRole('admin'), logAction('users'), userController.createUser);

// Actualizar usuario (solo admin o el mismo usuario)
router.put('/:id', logAction('users'), userController.updateUser);

// Cambiar contraseña
router.post('/:id/change-password', userController.changePassword);

// Eliminar usuario (solo admin)
router.delete('/:id', authorizeRole('admin'), logAction('users'), userController.deleteUser);

export default router;
