import axios from 'axios';
import { getDatabase } from '../config/database.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Preguntas frecuentes y respuestas por defecto
const FAQ = {
  horarios: 'Nuestro horario de atención es de lunes a viernes 8:00 AM - 6:00 PM, sábados 8:00 AM - 1:00 PM.',
  ubicacion: 'Nos encontramos en el centro farmacéutico de Malvinas. Puedes visitarnos o llamar al 02944-XXXXX.',
  productos: 'Contamos con una amplia variedad de medicamentos, suplementos y productos de farmacia. ¿Necesitas algo específico?',
  envios: 'Realizamos envíos a domicilio en la zona de Malvinas. Consúltanos los costos según tu ubicación.',
  reservas: 'Puedes hacer reservas de productos contactándonos vía WhatsApp o visitando nuestro sitio web.',
  contacto: 'Puedes contactarnos por WhatsApp, llamar al teléfono o visitarnos en persona.',
};

const DEFAULT_RESPONSES = [
  'Disculpa, no entendí bien tu pregunta. ¿Podrías reformularla?',
  'Gracias por tu consulta. Un especialista te contactará pronto.',
  'Para más información detallada, por favor contacta con nuestro equipo.',
];

async function getLLMSettings(promptType = 'admin') {
  const db = await getDatabase();
  const keys = promptType === 'admin' 
    ? ['llm_provider','groq_api_key','openai_api_key','llm_system_prompt','llm_model_groq','llm_model_openai']
    : ['llm_provider','groq_api_key','openai_api_key','whatsapp_system_prompt','llm_model_groq','llm_model_openai'];
  
  const rows = await db.all(`SELECT key, value FROM configurations WHERE key IN (${keys.map(() => '?').join(',')})`,[...keys]);
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  
  const provider = (map['llm_provider'] || 'groq').toLowerCase();
  const promptKey = promptType === 'admin' ? 'llm_system_prompt' : 'whatsapp_system_prompt';
  const defaultPrompt = promptType === 'admin' 
    ? 'Eres un asistente administrativo de Farmacia Científica Malvinas. Responde brevemente en español y con precisión. Si no tienes datos, sugiere cómo obtenerlos desde el sistema.'
    : 'Eres un asistente amable de farmacia para Farmacia Científica Malvinas. Responde brevemente en español (máximo 100 palabras). Si no puedes responder, sugiere contactar al equipo de farmacia.';
  
  return {
    provider: provider,
    groqKey: map['groq_api_key'] || '',
    openaiKey: map['openai_api_key'] || '',
    systemPrompt: map[promptKey] || defaultPrompt,
    groqModel: map['llm_model_groq'] || 'mixtral-8x7b-32768',
    openaiModel: map['llm_model_openai'] || 'gpt-3.5-turbo'
  };
}

export async function getAIResponse(message, conversationContext = '', promptType = 'whatsapp') {
  try {
    // Detectar palabras clave en el mensaje
    const messageLower = message.toLowerCase();
    
    // Respuestas por FAQ (para WhatsApp)
    if (promptType === 'whatsapp') {
      if (messageLower.includes('horario') || messageLower.includes('cuando')) {
        return FAQ.horarios;
      }
      if (messageLower.includes('ubicacion') || messageLower.includes('donde') || messageLower.includes('dirección')) {
        return FAQ.ubicacion;
      }
      if (messageLower.includes('producto') || messageLower.includes('medicamento')) {
        return FAQ.productos;
      }
      if (messageLower.includes('envio') || messageLower.includes('delivery')) {
        return FAQ.envios;
      }
      if (messageLower.includes('reserva') || messageLower.includes('reservacion')) {
        return FAQ.reservas;
      }
      if (messageLower.includes('contacto') || messageLower.includes('contactar')) {
        return FAQ.contacto;
      }
    }

    // Configurable LLM provider & system prompt
    const settings = await getLLMSettings(promptType);
    const systemPrompt = settings.systemPrompt;

    if (settings.provider === 'groq' && settings.groqKey) {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: settings.groqModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${settings.groqKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000
        }
      );
      return response.data.choices?.[0]?.message?.content || getDefaultResponse();
    }

    if (settings.provider === 'openai' && settings.openaiKey) {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: settings.openaiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${settings.openaiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000
        }
      );
      return response.data.choices?.[0]?.message?.content || getDefaultResponse();
    }

    // Fallback: respuesta por defecto
    return getDefaultResponse();
  } catch (error) {
    console.error('Error obteniendo respuesta de IA:', error);
    return getDefaultResponse();
  }
}

// Obtener respuesta por defecto aleatoria
function getDefaultResponse() {
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

// Validar mensaje
export function validateMessage(message) {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'El mensaje no puede estar vacío' };
  }
  if (message.length > 1000) {
    return { valid: false, error: 'El mensaje es demasiado largo (máximo 1000 caracteres)' };
  }
  return { valid: true };
}

// Generar contexto de conversación
export function generateConversationContext(messages) {
  return messages
    .slice(-5) // Últimos 5 mensajes
    .map(msg => `${msg.sender}: ${msg.message}`)
    .join('\n');
}

// Detectar intención del usuario
export function detectUserIntent(message) {
  const messageLower = message.toLowerCase();
  
  const intents = {
    horarios: ['horario', 'cuando', 'abierto', 'hora', 'atienden'],
    ubicacion: ['donde', 'ubicacion', 'dirección', 'local', 'farmacia'],
    productos: ['producto', 'medicamento', 'droga', 'comprar', 'vender', 'tienen'],
    envios: ['envio', 'delivery', 'domicilio', 'llevar', 'traer'],
    reserva: ['reserva', 'reservacion', 'guardar', 'apartar'],
    pago: ['pago', 'precio', 'costo', 'vale', 'dinero'],
    ayuda: ['ayuda', 'soporte', 'problema', 'error', 'no funciona'],
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      return intent;
    }
  }

  return 'general';
}
