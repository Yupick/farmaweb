import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import * as chatController from '../controllers/chatController.js';
import * as adminChatController from '../controllers/adminChatController.js';

const router = express.Router();

// Enviar mensaje (público para WhatsApp webhook)
router.post('/message', chatController.sendMessage);

// Obtener conversaciones (solo admin)
router.get('/', authenticateToken, authorizeRole('admin'), chatController.getConversations);

// Obtener conversación específica (solo admin)
router.get('/:id', authenticateToken, authorizeRole('admin'), chatController.getConversationById);

// Obtener mensajes de una conversación (solo admin)
router.get('/:conversationId/messages', authenticateToken, authorizeRole('admin'), chatController.getMessages);

// === ADMIN CHATBOT ===
// Enviar mensaje al chatbot administrativo
router.post('/admin', authenticateToken, authorizeRole('admin'), adminChatController.sendAdminMessage);

// Obtener historial del chatbot admin
router.get('/admin/history', authenticateToken, authorizeRole('admin'), adminChatController.getAdminHistory);

// Limpiar historial del chatbot admin
router.delete('/admin/history', authenticateToken, authorizeRole('admin'), adminChatController.clearAdminHistory);

export default router;
