import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as emailController from '../controllers/emailController.js';

const router = express.Router();

// Enviar email de prueba (solo admin)
router.post('/test', authenticateToken, authorizeRole('admin'), emailController.sendTestEmail);

// Obtener logs de email (solo admin)
router.get('/logs', authenticateToken, authorizeRole('admin'), emailController.getEmailLogs);

// Enviar respuesta a formulario de contacto (público)
router.post('/contact', emailController.sendContactFormEmail);

export default router;
