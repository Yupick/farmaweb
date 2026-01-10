import { getDatabase } from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

export async function createDefaultRoles() {
  const db = await getDatabase();
  
  const roles = [
    {
      name: 'admin',
      description: 'Administrador del sistema',
      permissions: JSON.stringify(['users.read', 'users.create', 'users.update', 'users.delete', 'config.read', 'config.write', 'content.manage', 'audit.read'])
    },
    {
      name: 'moderador',
      description: 'Moderador de contenido',
      permissions: JSON.stringify(['content.read', 'content.create', 'content.update', 'audit.read'])
    },
    {
      name: 'usuario',
      description: 'Usuario final',
      permissions: JSON.stringify(['profile.read', 'profile.update'])
    }
  ];

  for (const role of roles) {
    await db.run(
      `INSERT OR IGNORE INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
      [role.name, role.description, role.permissions]
    );
  }
}

export async function createAdminUser() {
  const db = await getDatabase();
  
  // Obtener ID del rol admin
  const adminRole = await db.get(`SELECT id FROM roles WHERE name = 'admin'`);
  
  if (!adminRole) {
    console.error('Rol admin no encontrado');
    return;
  }

  const email = process.env.ADMIN_EMAIL || 'admin@fciacientifica.com.ar';
  const password = process.env.ADMIN_PASSWORD || 'cientifica123';
  
  // Verificar si el usuario ya existe
  const existingUser = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
  if (existingUser) {
    console.log('Usuario admin ya existe');
    return;
  }

  const passwordHash = await hashPassword(password);
  
  await db.run(
    `INSERT INTO users (email, password_hash, first_name, last_name, role_id, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [email, passwordHash, 'Administrador', 'Sistema', adminRole.id, 'active']
  );

  console.log(`✅ Usuario admin creado: ${email}`);
}

export async function createDefaultConfigurations() {
  const db = await getDatabase();

  const configs = [
    { key: 'theme', value: 'light', type: 'string', description: 'Tema principal de la aplicación' },
    { key: 'pharmacy_name', value: process.env.PHARMACY_NAME || 'Farmacia Científica Malvinas', type: 'string', description: 'Nombre de la farmacia' },
    { key: 'pharmacy_phone', value: process.env.PHARMACY_PHONE || '+54911234567', type: 'string', description: 'Teléfono de la farmacia' },
    { key: 'pharmacy_email', value: process.env.PHARMACY_EMAIL || 'contacto@farmamalvinas.com', type: 'string', description: 'Email de la farmacia' },
    { key: 'pharmacy_address', value: process.env.PHARMACY_ADDRESS || 'Buenos Aires, Argentina', type: 'string', description: 'Dirección de la farmacia' },
    { key: 'pharmacy_whatsapp', value: process.env.PHARMACY_WHATSAPP || '+5491112345678', type: 'string', description: 'Número de WhatsApp' },
    { key: 'pharmacy_slogan', value: process.env.PHARMACY_SLOGAN || 'Tu farmacia de confianza en línea', type: 'string', description: 'Slogan comercial' },
    { key: 'header_links', value: JSON.stringify([{ label: 'Sobre', slug: 'sobre' }, { label: 'Productos', slug: 'productos' }, { label: 'Contacto', slug: 'contacto' }]), type: 'json', description: 'Enlaces de cabecera (JSON: [{label,slug}])' },
    { key: 'footer_links', value: JSON.stringify([{ label: 'Políticas', slug: 'politicas' }, { label: 'Términos', slug: 'terminos' }]), type: 'json', description: 'Enlaces de pie de página (JSON: [{label,slug}])' },
    { key: 'llm_provider', value: 'groq', type: 'string', description: 'Proveedor de LLM (groq/openai)' },
    { key: 'llm_model_groq', value: 'mixtral-8x7b-32768', type: 'string', description: 'Modelo de Groq' },
    { key: 'llm_model_openai', value: 'gpt-3.5-turbo', type: 'string', description: 'Modelo de OpenAI' },
    { key: 'groq_api_key', value: process.env.GROQ_API_KEY || '', type: 'string', description: 'API Key de Groq' },
    { key: 'openai_api_key', value: process.env.OPENAI_API_KEY || '', type: 'string', description: 'API Key de OpenAI' },
    { key: 'llm_system_prompt', value: 'Eres un asistente administrativo de Farmacia Científica Malvinas. Responde brevemente en español y con precisión. Si no tienes datos, sugiere cómo obtenerlos desde el sistema.', type: 'string', description: 'System prompt del chatbot administrativo' },
    { key: 'whatsapp_system_prompt', value: 'Eres un asistente amable de farmacia para Farmacia Científica Malvinas. Responde brevemente en español (máximo 100 palabras). Si no puedes responder, sugiere contactar al equipo de farmacia.', type: 'string', description: 'System prompt del chatbot cliente (WhatsApp)' },
    { key: 'whatsapp_enabled', value: 'false', type: 'boolean', description: 'WhatsApp habilitado' },
    { key: 'whatsapp_provider', value: 'meta', type: 'string', description: 'Proveedor de WhatsApp (meta/twilio)' },
    { key: 'whatsapp_phone_number', value: process.env.WHATSAPP_PHONE_NUMBER || '', type: 'string', description: 'Número de WhatsApp de la farmacia' },
    { key: 'meta_api_token', value: process.env.META_API_TOKEN || '', type: 'string', description: 'Token de API de Meta WhatsApp Cloud API' },
    { key: 'meta_phone_id', value: process.env.META_PHONE_ID || '', type: 'string', description: 'Phone Number ID de Meta WhatsApp' },
    { key: 'meta_verify_token', value: process.env.META_VERIFY_TOKEN || '', type: 'string', description: 'Verify Token para webhook de Meta' },
    { key: 'twilio_account_sid', value: process.env.TWILIO_ACCOUNT_SID || '', type: 'string', description: 'Account SID de Twilio' },
    { key: 'twilio_auth_token', value: process.env.TWILIO_AUTH_TOKEN || '', type: 'string', description: 'Auth Token de Twilio' },
    { key: 'twilio_whatsapp_number', value: process.env.TWILIO_WHATSAPP_NUMBER || '', type: 'string', description: 'Número de WhatsApp de Twilio (formato: whatsapp:+1234567890)' },
    { key: 'instagram_enabled', value: 'false', type: 'boolean', description: 'Instagram habilitado' }
  ];

  for (const config of configs) {
    await db.run(
      `INSERT OR IGNORE INTO configurations (key, value, type, description) VALUES (?, ?, ?, ?)`,
      [config.key, config.value, config.type, config.description]
    );
  }
}

export async function seedDatabase() {
  try {
    await createDefaultRoles();
    await createAdminUser();
    await createDefaultConfigurations();
    console.log('✅ Base de datos inicializada exitosamente');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    throw error;
  }
}
