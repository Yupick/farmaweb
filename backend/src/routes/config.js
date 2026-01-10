import express from 'express';
import { authenticateToken, authorizeRole, logAction } from '../middleware/auth.js';
import * as configController from '../controllers/configController.js';

const router = express.Router();

// Obtener todas las configuraciones (público)
router.get('/', configController.getConfigurations);

// Obtener configuración específica (público)
router.get('/:key', configController.getConfiguration);

// Actualizar configuración (solo admin)
router.put('/:key', authenticateToken, authorizeRole('admin'), logAction('configurations'), configController.updateConfiguration);

export default router;
