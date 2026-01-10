import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as instagramController from '../controllers/instagramController.js';

const router = express.Router();

// Obtener perfil de Instagram (público)
router.get('/profile', instagramController.getInstagramProfile);

// Obtener feed de Instagram (público)
router.get('/feed', instagramController.getInstagramFeed);

// Obtener posts guardados (público)
router.get('/posts', instagramController.getSavedInstagramPosts);

// Sincronizar feed (solo admin)
router.post('/sync', authenticateToken, authorizeRole('admin'), instagramController.syncInstagramFeed);

export default router;
