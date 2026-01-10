import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log('📊 Inicializando base de datos...');
    
    const db = await open({
      filename: path.join(__dirname, '../data/farmacia.db'),
      driver: sqlite3.Database
    });

    console.log('✅ Conectado a la base de datos');

    // Crear tabla de usuarios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla users creada');

    // Crear tabla de contenido
    await db.exec(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla content creada');

    // Crear tabla de conversaciones de chat
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT,
        user_name TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla chat_conversations creada');

    // Crear tabla de mensajes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER,
        sender TEXT,
        message TEXT,
        message_type TEXT DEFAULT 'text',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
      );
    `);
    console.log('✅ Tabla chat_messages creada');

    // Crear tabla de productos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        sku TEXT UNIQUE,
        category TEXT,
        brand TEXT,
        price REAL,
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        popularity INTEGER DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla products creada');

    // Crear tabla de posts Instagram
    await db.exec(`
      CREATE TABLE IF NOT EXISTS instagram_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id TEXT UNIQUE,
        caption TEXT,
        media_type TEXT,
        media_url TEXT,
        permalink TEXT,
        timestamp DATETIME,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla instagram_posts creada');

    // Crear tabla de reservaciones
    await db.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT,
        email TEXT,
        product_id INTEGER,
        quantity INTEGER,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        cancellation_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla reservations creada');

    // Crear tabla de logs de email
    await db.exec(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient TEXT,
        subject TEXT,
        status TEXT DEFAULT 'pending',
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla email_logs creada');

    // Insertar usuario admin
    const adminPassword = '$2b$10$qXGYzjsFW/SPKx65NWr9dO6e68LD2aLI.LIKUqNNV.xVBW.qRrEXi'; // cifrado
    await db.run(
      'INSERT OR IGNORE INTO users (email, password, name, role, active) VALUES (?, ?, ?, ?, ?)',
      ['admin@fciacientifica.com.ar', adminPassword, 'Administrador', 'admin', 1]
    );
    console.log('✅ Usuario admin insertado');

    // Crear índices
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
      CREATE INDEX IF NOT EXISTS idx_chat_conv_phone ON chat_conversations(phone_number);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_instagram_timestamp ON instagram_posts(timestamp);
    `);
    console.log('✅ Índices creados');

    await db.close();
    console.log('\n✅ Base de datos inicializada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
