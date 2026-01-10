import axios from 'axios';
import { getDatabase } from '../config/database.js';

/**
 * Obtiene la configuración de WhatsApp desde la base de datos
 */
export async function getWhatsAppConfig() {
  const db = await getDatabase();
  
  const configs = await db.all(
    `SELECT key, value FROM configurations WHERE key LIKE 'whatsapp%' OR key LIKE 'meta%' OR key LIKE 'twilio%'`
  );
  
  const configMap = {};
  configs.forEach(c => {
    configMap[c.key] = c.value;
  });
  
  return {
    provider: configMap['whatsapp_provider'] || 'meta',
    phoneNumber: configMap['whatsapp_phone_number'] || '',
    meta: {
      apiToken: configMap['meta_api_token'] || '',
      phoneId: configMap['meta_phone_id'] || '',
      verifyToken: configMap['meta_verify_token'] || ''
    },
    twilio: {
      accountSid: configMap['twilio_account_sid'] || '',
      authToken: configMap['twilio_auth_token'] || '',
      whatsappNumber: configMap['twilio_whatsapp_number'] || ''
    }
  };
}

/**
 * Envía un mensaje de WhatsApp usando el proveedor configurado
 * @param {string} to - Número de teléfono destinatario (formato: +1234567890)
 * @param {string} message - Texto del mensaje
 */
export async function sendWhatsAppMessage(to, message) {
  const config = await getWhatsAppConfig();
  
  if (config.provider === 'meta') {
    return await sendMetaMessage(to, message, config.meta);
  } else if (config.provider === 'twilio') {
    return await sendTwilioMessage(to, message, config.twilio);
  } else {
    throw new Error(`Proveedor de WhatsApp no soportado: ${config.provider}`);
  }
}

/**
 * Envía mensaje usando Meta WhatsApp Cloud API
 */
async function sendMetaMessage(to, message, metaConfig) {
  const { apiToken, phoneId } = metaConfig;
  
  if (!apiToken || !phoneId) {
    throw new Error('Configuración de Meta WhatsApp incompleta (API Token o Phone ID faltante)');
  }
  
  // Limpiar número: eliminar espacios, guiones y asegurar formato +1234567890
  const cleanTo = to.replace(/[\s\-\(\)]/g, '');
  
  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
  
  const payload = {
    messaging_product: 'whatsapp',
    to: cleanTo,
    type: 'text',
    text: {
      body: message
    }
  };
  
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Mensaje enviado vía Meta WhatsApp:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error enviando mensaje vía Meta:', error.response?.data || error.message);
    throw new Error(`Error enviando mensaje vía Meta: ${error.response?.data?.error?.message || error.message}`);
  }
}

/**
 * Envía mensaje usando Twilio WhatsApp API
 */
async function sendTwilioMessage(to, message, twilioConfig) {
  const { accountSid, authToken, whatsappNumber } = twilioConfig;
  
  if (!accountSid || !authToken || !whatsappNumber) {
    throw new Error('Configuración de Twilio WhatsApp incompleta');
  }
  
  // Limpiar número y agregar prefijo whatsapp: si es necesario
  let cleanTo = to.replace(/[\s\-\(\)]/g, '');
  if (!cleanTo.startsWith('whatsapp:')) {
    cleanTo = `whatsapp:${cleanTo}`;
  }
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  const params = new URLSearchParams();
  params.append('From', whatsappNumber);
  params.append('To', cleanTo);
  params.append('Body', message);
  
  try {
    const response = await axios.post(url, params, {
      auth: {
        username: accountSid,
        password: authToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('✅ Mensaje enviado vía Twilio WhatsApp:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error enviando mensaje vía Twilio:', error.response?.data || error.message);
    throw new Error(`Error enviando mensaje vía Twilio: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Verifica el token del webhook (usado por Meta)
 * @param {string} mode - Modo de verificación
 * @param {string} token - Token enviado por Meta
 * @param {string} challenge - Challenge a devolver
 */
export async function verifyWebhookToken(mode, token, challenge) {
  const config = await getWhatsAppConfig();
  
  if (mode === 'subscribe' && token === config.meta.verifyToken) {
    console.log('✅ Webhook verificado correctamente');
    return challenge;
  } else {
    console.error('❌ Token de verificación incorrecto');
    throw new Error('Token de verificación incorrecto');
  }
}

/**
 * Extrae el mensaje y el número de teléfono de un webhook de Meta
 */
export function parseMetaWebhook(body) {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    
    if (!message) {
      return null;
    }
    
    return {
      from: message.from,
      messageId: message.id,
      timestamp: message.timestamp,
      text: message.text?.body || '',
      type: message.type
    };
  } catch (error) {
    console.error('Error parseando webhook de Meta:', error);
    return null;
  }
}

/**
 * Extrae el mensaje y el número de teléfono de un webhook de Twilio
 */
export function parseTwilioWebhook(body) {
  try {
    return {
      from: body.From?.replace('whatsapp:', ''),
      messageId: body.MessageSid,
      timestamp: new Date().toISOString(),
      text: body.Body || '',
      type: 'text'
    };
  } catch (error) {
    console.error('Error parseando webhook de Twilio:', error);
    return null;
  }
}
