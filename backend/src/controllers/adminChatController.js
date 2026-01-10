import * as adminChatService from '../services/adminChatService.js';

/**
 * Procesa mensaje del chatbot administrativo
 */
export async function sendAdminMessage(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const response = await adminChatService.processAdminMessage(message, userId);
    
    res.json({ response });
  } catch (error) {
    console.error('Error en admin chat:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Obtiene el historial de conversaciones del admin
 */
export async function getAdminHistory(req, res) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const history = await adminChatService.getAdminChatHistory(userId, limit);
    
    res.json(history);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * Limpia el historial de conversaciones
 */
export async function clearAdminHistory(req, res) {
  try {
    const userId = req.user.id;

    await adminChatService.clearAdminChatHistory(userId);
    
    res.json({ message: 'Historial limpiado correctamente' });
  } catch (error) {
    console.error('Error limpiando historial:', error);
    res.status(500).json({ error: error.message });
  }
}
