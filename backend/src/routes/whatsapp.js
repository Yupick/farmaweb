import express from 'express';
import * as whatsappController from '../controllers/whatsappController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/webhooks/whatsapp
 * Verificación del webhook (Meta WhatsApp Cloud API)
 */
router.get('/', whatsappController.verifyWebhook);

/**
 * POST /api/webhooks/whatsapp
 * Recepción de mensajes entrantes (Meta y Twilio)
 */
router.post('/', whatsappController.handleIncomingMessage);

/**
 * POST /api/webhooks/whatsapp/test
 * Envío de mensaje de prueba (requiere autenticación)
 */
router.post('/test', authenticate, whatsappController.sendTestMessage);

export default router;
