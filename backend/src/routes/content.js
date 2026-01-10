import express from 'express';
import { authenticateToken, authorizeRole, logAction } from '../middleware/auth.js';
import * as contentController from '../controllers/contentController.js';

const router = express.Router();

// Obtener contenido público (sin autenticación)
router.get('/', contentController.getPublicContent);
router.get('/:id', contentController.getContentById);

// Crear/Actualizar/Eliminar contenido (solo admin)
router.post('/', authenticateToken, authorizeRole('admin'), logAction('content'), contentController.createContent);
router.put('/:id', authenticateToken, authorizeRole('admin'), logAction('content'), contentController.updateContent);
router.delete('/:id', authenticateToken, authorizeRole('admin'), logAction('content'), contentController.deleteContent);

// Obtener contenido por tipo
router.get('/type/:type', contentController.getContentByType);

export default router;
