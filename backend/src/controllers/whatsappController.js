import * as whatsappService from '../services/whatsappService.js';
import * as chatService from '../services/chatService.js';

/**
 * Verifica el webhook de WhatsApp (GET request de Meta)
 */
export async function verifyWebhook(req, res) {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (!mode || !token) {
      return res.status(400).json({ error: 'Parámetros de verificación faltantes' });
    }

    const verifiedChallenge = await whatsappService.verifyWebhookToken(mode, token, challenge);
    res.status(200).send(verifiedChallenge);
  } catch (error) {
    console.error('Error verificando webhook:', error);
    res.status(403).json({ error: 'Verificación fallida' });
  }
}

/**
 * Maneja mensajes entrantes de WhatsApp (POST request)
 */
export async function handleIncomingMessage(req, res) {
  try {
    console.log('📨 Webhook recibido:', JSON.stringify(req.body, null, 2));

    // Responder rápido a Meta/Twilio (200 OK)
    res.status(200).send('EVENT_RECEIVED');

    // Determinar proveedor y parsear mensaje
    const config = await whatsappService.getWhatsAppConfig();
    let parsedMessage;

    if (config.provider === 'meta') {
      parsedMessage = whatsappService.parseMetaWebhook(req.body);
    } else if (config.provider === 'twilio') {
      parsedMessage = whatsappService.parseTwilioWebhook(req.body);
    }

    if (!parsedMessage || !parsedMessage.text) {
      console.log('⚠️ Mensaje no válido o sin texto, ignorando');
      return;
    }

    console.log('✅ Mensaje parseado:', parsedMessage);

    // Procesar mensaje con el chatbot (async, no bloqueante)
    processMessageAsync(parsedMessage.from, parsedMessage.text);

  } catch (error) {
    console.error('❌ Error manejando mensaje entrante:', error);
    // Ya respondimos 200, solo logueamos el error
  }
}

/**
 * Procesa el mensaje de forma asíncrona: guarda en DB, llama IA, responde
 */
async function processMessageAsync(phoneNumber, messageText) {
  try {
    // 1. Crear o recuperar conversación
    let conversation = await chatService.getConversationByPhone(phoneNumber);
    
    if (!conversation) {
      conversation = await chatService.createConversation(phoneNumber);
      console.log(`📝 Nueva conversación creada para ${phoneNumber}`);
    }

    // 2. Guardar mensaje del usuario
    await chatService.saveMessage(conversation.id, 'user', messageText);

    // 3. Obtener respuesta de la IA
    console.log('🤖 Consultando IA...');
    const aiResponse = await chatService.getAIResponseFromLLM(conversation.id, messageText);

    // 4. Guardar respuesta del bot
    await chatService.saveMessage(conversation.id, 'bot', aiResponse);

    // 5. Enviar respuesta por WhatsApp
    console.log(`📤 Enviando respuesta a ${phoneNumber}...`);
    await whatsappService.sendWhatsAppMessage(phoneNumber, aiResponse);
    
    console.log('✅ Mensaje procesado y enviado correctamente');

  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    
    // Intentar enviar mensaje de error al usuario
    try {
      await whatsappService.sendWhatsAppMessage(
        phoneNumber,
        'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente en unos momentos.'
      );
    } catch (sendError) {
      console.error('❌ Error enviando mensaje de error:', sendError);
    }
  }
}

/**
 * Endpoint de prueba para enviar mensajes manualmente (opcional)
 */
export async function sendTestMessage(req, res) {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Número y mensaje son requeridos' });
    }

    const result = await whatsappService.sendWhatsAppMessage(to, message);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error enviando mensaje de prueba:', error);
    res.status(500).json({ error: error.message });
  }
}
