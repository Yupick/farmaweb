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

  const email = process.env.ADMIN_EMAIL || 'admin@farmamalvinas.com';
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
    { key: 'llm_provider', value: 'groq', type: 'string', description: 'Proveedor de LLM (groq/openai)' },
    { key: 'whatsapp_enabled', value: 'false', type: 'boolean', description: 'WhatsApp habilitado' },
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
