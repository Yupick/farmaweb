import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as auditController from '../controllers/auditController.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener logs de auditoría (solo admin)
router.get('/', authorizeRole('admin'), auditController.getAuditLogs);

// Obtener logs de auditoría del usuario actual
router.get('/my-activity', auditController.getMyActivity);

export default router;
