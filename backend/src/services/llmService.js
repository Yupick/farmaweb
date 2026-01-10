import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

export async function getAIResponse(message: string, conversationContext: string = '') {
  try {
    // Detectar palabras clave en el mensaje
    const messageLower = message.toLowerCase();
    
    // Respuestas por FAQ
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

    // Si hay API key de Groq, usar IA
    if (GROQ_API_KEY && GROQ_API_KEY !== '') {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'mixtral-8x7b-32768', // Modelo disponible en Groq
          messages: [
            {
              role: 'system',
              content: `Eres un asistente amable de farmacia para Farmacia Científica Malvinas. Responde brevemente en español (máximo 100 palabras). 
Si no puedes responder, sugiere contactar al equipo de farmacia.
Información de la farmacia:
- Horarios: Lunes-Viernes 8:00-18:00, Sábados 8:00-13:00
- Ubicación: Centro farmacéutico de Malvinas
- Servicios: Venta de medicamentos, suplementos, asesoramiento farmacéutico, envíos a domicilio`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000
        }
      );

      return response.data.choices[0]?.message?.content || getDefaultResponse();
    }

    // Fallback: respuesta por defecto
    return getDefaultResponse();
  } catch (error) {
    console.error('Error obteniendo respuesta de IA:', error);
    return getDefaultResponse();
  }
}

// Obtener respuesta por defecto aleatoria
function getDefaultResponse(): string {
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

// Validar mensaje
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'El mensaje no puede estar vacío' };
  }
  if (message.length > 1000) {
    return { valid: false, error: 'El mensaje es demasiado largo (máximo 1000 caracteres)' };
  }
  return { valid: true };
}

// Generar contexto de conversación
export function generateConversationContext(messages: Array<{ sender: string; message: string }>): string {
  return messages
    .slice(-5) // Últimos 5 mensajes
    .map(msg => `${msg.sender}: ${msg.message}`)
    .join('\n');
}

// Detectar intención del usuario
export function detectUserIntent(message: string): string {
  const messageLower = message.toLowerCase();
  
  const intents: { [key: string]: string[] } = {
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
