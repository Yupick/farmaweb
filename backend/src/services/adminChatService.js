import { getDatabase } from '../config/database.js';
import * as llmService from './llmService.js';

/**
 * Procesa mensajes del chatbot administrativo
 * Tiene acceso a consultas de BD y análisis de datos
 */
export async function processAdminMessage(message, userId) {
  const db = await getDatabase();
  
  // Obtener contexto de la base de datos para el LLM
  const context = await gatherDatabaseContext(db);
  
  // Crear prompt enriquecido con datos del sistema
  const enrichedPrompt = `Eres un asistente administrativo con acceso a la base de datos del sistema.

DATOS DEL SISTEMA:
${context}

PREGUNTA DEL ADMINISTRADOR:
${message}

INSTRUCCIONES:
- Responde de manera clara y concisa
- Si la pregunta requiere datos específicos, usa la información proporcionada
- Si no tienes la información exacta, sugiere qué consulta se podría hacer
- Mantén un tono profesional pero amigable
- Formatea las respuestas con markdown cuando sea apropiado

RESPUESTA:`;

  try {
    let response;

    const hasLLM = !!(process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY);
    const text = message.toLowerCase();
    const adminKeywords = ['usuario', 'usuarios', 'conversacion', 'conversaciones', 'chat', 'config', 'configuracion', 'configuraciones', 'auditoria', 'audit'];

    if (adminKeywords.some(k => text.includes(k))) {
      // Consultas administrativas → usar respuesta offline basada en BD
      response = await getOfflineAdminResponse(message, db, context);
    } else if (hasLLM && llmService.getAIResponse) {
      // Consultas generales → usar LLM si está disponible
      response = await llmService.getAIResponse(message, context);
    } else {
      // Fallback
      response = await getOfflineAdminResponse(message, db, context);
    }

    // Guardar conversación en auditoría
    await db.run(
      `INSERT INTO audit_logs (user_id, action, resource, changes) VALUES (?, ?, ?, ?)`,
      [userId, 'admin_chat', 'chatbot', JSON.stringify({ question: message, response })]
    );

    return response;
  } catch (error) {
    console.error('Error en chatbot admin:', error);
    throw new Error('Error al procesar el mensaje');
  }
}

/**
 * Recopila contexto relevante de la base de datos
 */
async function gatherDatabaseContext(db) {
  try {
    // Estadísticas de usuarios
    const userStats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
      FROM users
    `);

    // Estadísticas de conversaciones
    const chatStats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM chat_conversations
    `);

    // Últimas configuraciones
    const configs = await db.all(`
      SELECT key, value, description 
      FROM configurations 
      ORDER BY updated_at DESC 
      LIMIT 10
    `);

    // Roles disponibles
    const roles = await db.all(`
      SELECT name, description 
      FROM roles
    `);

    // Últimos registros de auditoría
    const recentAudits = await db.all(`
      SELECT action, resource, created_at 
      FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    // Construir resumen
    let context = `
ESTADÍSTICAS DE USUARIOS:
- Total: ${userStats.total}
- Activos: ${userStats.active}
- Inactivos: ${userStats.inactive}

ESTADÍSTICAS DE CONVERSACIONES:
- Total de conversaciones: ${chatStats.total || 0}
- Conversaciones activas: ${chatStats.active || 0}

ROLES DEL SISTEMA:
${roles.map(r => `- ${r.name}: ${r.description}`).join('\n')}

CONFIGURACIONES PRINCIPALES:
${configs.map(c => `- ${c.key}: ${c.value} (${c.description})`).join('\n')}

ÚLTIMAS ACCIONES (AUDITORÍA):
${recentAudits.map(a => `- ${a.action} en ${a.resource} (${new Date(a.created_at).toLocaleString('es-AR')})`).join('\n')}
`;

    return context;
  } catch (error) {
    console.error('Error recopilando contexto:', error);
    return 'Error al recopilar información del sistema.';
  }
}

/**
 * Respuesta offline (sin LLM) para preguntas frecuentes del admin
 */
async function getOfflineAdminResponse(message, db, contextText) {
  const text = message.toLowerCase();

  // Usuarios
  if (text.includes('usuario') || text.includes('usuarios')) {
    const stats = await db.get(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as activos,
             SUM(CASE WHEN status='inactive' THEN 1 ELSE 0 END) as inactivos
      FROM users
    `);
    return `Usuarios del sistema:\n- Total: ${stats.total}\n- Activos: ${stats.activos || 0}\n- Inactivos: ${stats.inactivos || 0}`;
  }

  // Conversaciones
  if (text.includes('conversacion') || text.includes('conversaciones') || text.includes('chat')) {
    const stats = await db.get(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) as activas
      FROM chat_conversations
    `);
    return `Conversaciones de chat:\n- Total: ${stats.total || 0}\n- Activas: ${stats.activas || 0}`;
  }

  // Configuraciones
  if (text.includes('config') || text.includes('configuracion') || text.includes('configuraciones')) {
    const configs = await db.all(`
      SELECT key, value FROM configurations ORDER BY updated_at DESC LIMIT 5
    `);
    if (!configs || configs.length === 0) {
      return 'No hay configuraciones registradas.';
    }
    return 'Configuraciones recientes:\n' + configs.map(c => `- ${c.key}: ${c.value}`).join('\n');
  }

  // Auditoría
  if (text.includes('auditoria') || text.includes('audit')) {
    const audits = await db.all(`
      SELECT action, resource, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5
    `);
    if (!audits || audits.length === 0) {
      return 'No hay registros de auditoría recientes.';
    }
    return 'Últimas acciones registradas:\n' + audits.map(a => `- ${a.action} en ${a.resource} (${new Date(a.created_at).toLocaleString('es-AR')})`).join('\n');
  }

  // Resumen por defecto
  return `Resumen del sistema:\n\n${contextText}\n\n(Para respuestas más precisas, puedes preguntar: \"¿Cuántos usuarios activos hay?\", \"Muestra las últimas 5 acciones de auditoría\", \"¿Qué configuraciones están definidas?\".)`;
}

/**
 * Obtiene el historial de conversaciones del admin chatbot
 */
export async function getAdminChatHistory(userId, limit = 50) {
  const db = await getDatabase();
  
  const logs = await db.all(
    `SELECT changes, created_at 
     FROM audit_logs 
     WHERE user_id = ? AND action = 'admin_chat' 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [userId, limit]
  );

  return logs.map(log => {
    try {
      const data = JSON.parse(log.changes);
      return {
        question: data.question,
        response: data.response,
        timestamp: log.created_at
      };
    } catch {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Limpia el historial de conversaciones del admin
 */
export async function clearAdminChatHistory(userId) {
  const db = await getDatabase();
  
  await db.run(
    `DELETE FROM audit_logs WHERE user_id = ? AND action = 'admin_chat'`,
    [userId]
  );
}
