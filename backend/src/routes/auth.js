import express from 'express';
import { authenticateToken, authorizeRole, logAction } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Rutas públicas
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/health', authController.health);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);

export default router;
